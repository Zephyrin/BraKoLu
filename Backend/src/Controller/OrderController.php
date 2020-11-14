<?php

namespace App\Controller;

use App\Controller\Helpers\HelperController;
use App\Entity\Order;
use App\Repository\OrderRepository;
use App\Form\OrderType;
use App\Controller\Helpers\HelperForwardController;
use App\Entity\Brew;
use App\Entity\BrewStock;
use App\Entity\IngredientStock;
use App\Entity\StockNotOrder;
use App\Repository\BrewRepository;
use App\Repository\IngredientStockRepository;
use App\Serializer\FormErrorSerializer;

use FOS\RestBundle\Controller\AbstractFOSRestController;
use Symfony\Component\Routing\Annotation\Route;
use Swagger\Annotations as SWG;
use Doctrine\ORM\EntityManagerInterface;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\Controller\Annotations\QueryParam;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Nelmio\ApiDocBundle\Annotation\Model;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Component\HttpKernel\Exception\PreconditionFailedHttpException;
use DateTime;

/**
 * Class OrderController
 * @package App\Controller
 *
 * @Route("api")
 * @SWG\Tag(name="Order")
 * 
 */
class OrderController extends AbstractFOSRestController
{
    /**
     * Utilise les fonctionnalités écritent dans HelperController.
     */
    use HelperController;

    /**
     * @var EntityManagerInterface
     */
    private $entityManager;
    /**
     * @var OrderRepository
     */
    private $repository;
    /**
     * @var BrewRepository
     */
    private $brewRepository;
    /**
     * @var IngredientStockRepository
     */
    private $stockRepository;
    /**
     * @var FormErrorSerializer
     */
    private $formErrorSerializer;

    public function __construct(
        EntityManagerInterface $entityManager,
        OrderRepository $repository,
        BrewRepository $brewRepository,
        IngredientStockRepository $stockRepository,
        FormErrorSerializer $formErrorSerializer
    ) {
        $this->entityManager = $entityManager;
        $this->repository = $repository;
        $this->brewRepository = $brewRepository;
        $this->stockRepository = $stockRepository;
        $this->formErrorSerializer = $formErrorSerializer;
    }

    /**
     * @Route("/order",
     *  name="api_order_post",
     *  methods={"POST"}
     * )
     * 
     * @SWG\Post(
     *  consumes={"application/json"},
     *  produces={"application/json"},
     *  summary="Crée une nouvelle commande vide qui aura le status créé.",
     *  @SWG\Response(
     *      response=201,
     *      description="La commande a bien été inséré",
     *      @SWG\Schema(ref=@Model(type=Order::class))
     *  ),
     *  @SWG\Response(
     *      response=302,
     *      description="Une commande en création existe déjà."
     *  )
     * )
     * @param Request $request
     * @return View|JsonResponse
     * @throws ExceptionInterface
     */
    public function postAction(Request $request)
    {
        $order = $this->repository->findOneBy(['state' => 'created']);
        if ($order == null) {
            $newEntity = new Order();
            $newEntity->setState('created');
            $newEntity->setCreated(new DateTime());
            $this->entityManager->persist($newEntity);

            $this->entityManager->flush();
            return $this->view($newEntity, Response::HTTP_CREATED);
        }
        return $this->view($order, Response::HTTP_FOUND);
    }

    /**
     * @Route("/order/pronostic/{id}",
     *  name="api_order_pronostic_get",
     *  methods={"GET"},
     *  requirements={
     *      "id": "\d+"
     * })
     * 
     * @SWG\Get(
     *     summary="Donne pronostic de la futur commande à réaliser.",
     *     produces={"application/json"}
     * )
     * @SWG\Parameter(
     *     name="JSON du Stock",
     *     required=true,
     *     @SWG\Schema(ref=@Model(type=Brew::class)),
     *     description="Une liste de brassin."
     * )
     * @SWG\Response(
     *     response=200,
     *     description="Un nouveau pronostique bassé sur les brassins données en arguments.",
     *     @SWG\Schema(ref=@Model(type=Order::class))
     * )
     * 
     * @QueryParam(name="brews"
     *      , description="La liste des brassing à commander.")
     *
     * @param string $id
     * @param ParamFetcher $paramFetcher
     * @return View
     */
    public function pronostic(Request $request, ParamFetcher $paramFetcher, string $id)
    {
        $brews = $paramFetcher->get('brews');
        $order = $this->repository->find($id);
        // Néttoyage de la précédentes préparation.
        $stockNotOrders = $order->getStockNotOrders();
        foreach ($stockNotOrders as $stockNotOrder) {
            $this->entityManager->remove($stockNotOrder->getBrewStock());
            $this->entityManager->remove($stockNotOrder);
        }
        $stocks = $order->getStocks();
        foreach ($stocks as $stock) {
            if ($stock->getState() == 'created')
                $order->removeStock($stock);
            $this->entityManager->remove($stock);
        }
        $this->entityManager->flush();
        $order = $this->repository->find($id);
        // On stock l'id de l'igredient et ça quantité.
        $ingredientsQuantity = [];
        if ($brews != null) {
            foreach ($brews as $brew) {
                $dbBrew = $this->getBrewById($brew);
                foreach ($dbBrew->getBrewIngredients() as $ingredient) {
                    // Association à la volé du stock si disponible sinon création 
                    if (isset($ingredientsQuantity[$ingredient->getIngredient()->getId()])) {
                        // On a déjà ajouté un nouvel ingrédient au stock. On utilise celui-ci.
                        $stock = $ingredientsQuantity[$ingredient->getIngredient()->getId()];
                        $stock->setQuantity($stock->getQuantity() + $ingredient->getQuantity());
                        $brewStock = new BrewStock();
                        $brewStock->setApply(false);
                        $brewStock->setQuantity($ingredient->getQuantity());
                        $stock->addBrewStock($brewStock);
                        $dbBrew->addBrewStock($brewStock);
                        $this->entityManager->persist($brewStock);
                    } else {
                        $stocks = $this->stockRepository->findAvalaibleStock($ingredient->getIngredient()->getId());
                        $quantity = $ingredient->getQuantity();
                        foreach ($stocks as $stock) {
                            // On regarde si l'ingrédient peut être contenu dans la liste des stocks.
                            $stockQuantity = $stock->calcFreeQuantity();
                            if ($stockQuantity > 0) {
                                if ($stockQuantity >= $quantity) {
                                    // Il y a plus de stock que ce que l'on a besoin. On associe le brassin au stock.
                                    $brewStock = new BrewStock();
                                    $dbBrew->addBrewStock($brewStock);
                                    $brewStock->setStock($stock);
                                    $brewStock->setQuantity($quantity);
                                    $brewStock->setApply(false);
                                    // Ne doit pas être sauvegardé car ne pointe pas sur la bonne commande.
                                    $stockNotOrder = new StockNotOrder();
                                    $order->addStockNotOrder($stockNotOrder);
                                    $brewStock->setStockNotOrder($stockNotOrder);
                                    $stockNotOrder->setBrewStock($brewStock);
                                    $this->entityManager->persist($brewStock);
                                    $this->entityManager->persist($stockNotOrder);
                                    $quantity = 0;
                                } else {
                                    $brewStock = new BrewStock();
                                    $dbBrew->addBrewStock($brewStock);
                                    $brewStock->setApply(false);

                                    $brewStock->setQuantity($quantity - $stockQuantity);
                                    // Doit-être sauvegarder
                                    $stock->addBrewStock($brewStock);
                                    $this->entityManager->persist($brewStock);
                                    // Ne doit pas être sauvegardé car ne pointe pas sur la bonne commande.
                                    $stockNotOrder = new StockNotOrder();
                                    $order->addStockNotOrder($stockNotOrder);
                                    $brewStock->setStockNotOrder($stockNotOrder);
                                    $stockNotOrder->setBrewStock($brewStock);
                                    $this->entityManager->persist($stockNotOrder);
                                    $quantity = $quantity - ($quantity - $stockQuantity);
                                }
                                if ($quantity == 0) break;
                            }
                        }
                        if ($quantity > 0) {
                            // Création d'un nouveau stock.
                            $stock = new IngredientStock();
                            $stock->setIngredient($ingredient->getIngredient());
                            $stock->setCreationDate(new DateTime());
                            $stock->setQuantity($quantity);
                            $stock->setState("created");
                            $order->addStock($stock);
                            $this->entityManager->persist($stock);
                            $brewStock = new BrewStock();
                            $dbBrew->addBrewStock($brewStock);
                            $brewStock->setApply(false);
                            $stock->addBrewStock($brewStock);
                            $brewStock->setQuantity($quantity);
                            $this->entityManager->persist($brewStock);
                            $ingredientsQuantity[$ingredient->getIngredient()->getId()] = $stock;
                        }
                    }
                }
            }
        }
        $this->entityManager->flush();
        return $this->view($order);
    }

    /**
     * @Route("/order/{id}",
     *  name="api_order_get",
     *  methods={"GET"},
     *  requirements={
     *      "id": "\d+"
     * })
     * 
     * @SWG\Get(
     *     summary="Donne les informations du brassin",
     *     produces={"application/json"}
     * )
     * @SWG\Response(
     *     response=200,
     *     description="Le brassin a bien été trouvé.",
     *     @SWG\Schema(ref=@Model(type=Order::class))
     * )
     *
     * @SWG\Response(
     *     response=404,
     *     description="Le brassin n'existe pas encore."
     * )
     * @param string $id
     * @return View
     */
    public function getAction(string $id)
    {
        return $this->view($this->getById($id));
    }

    /**
     * @Route("/orders",
     *  name="api_order_gets",
     *  methods={"GET"})
     * 
     * @SWG\Get(
     *     summary="Retourne la liste de tout les brassins en fonction des paramètres de recherche et de pagination. ",
     *     produces={"application/json"}
     * )
     * @SWG\Response(
     *     response=200,
     *     description="Retourne une JSON liste de tout le stock.",
     *     @SWG\Schema(ref=@Model(type=Order::class))
     * )
     *
     * @QueryParam(name="page"
     *      , requirements="\d+"
     *      , default="1"
     *      , description="La page en cours.")
     * @QueryParam(name="limit"
     *      , requirements="\d+"
     *      , default="0"
     *      , description="Le nombre de ligne de brassin à retourner dans la liste. 0 pour tous.")
     * @QueryParam(name="sort"
     *      , requirements="(asc|desc)"
     *      , allowBlank=false
     *      , default="asc"
     *      , description="La direction du tri.")
     * @QueryParam(name="sortBy"
     *      , requirements="(id|created|state)"
     *      , default="created"
     *      , description="Le tri est organisé sur les attributs de la classe order.")
     * @QueryParam(name="search"
     *      , nullable=true
     *      , description="Recherche dans la base sur les attributs de la classe order.")
     *
     * @param ParamFetcher $paramFetcher
     * @return View
     */
    public function getAllAction(ParamFetcher $paramFetcher)
    {
        $orders = $this->repository->findAllPagination($paramFetcher);
        foreach ($orders[0] as $order) {
            if ($order->getState() == 'created') {
                foreach ($order->getStockNotOrders() as $stockNotOrder) {
                    $stock = $stockNotOrder->getBrewStock()->getStock();
                    $stock->setQuantity($stock->calcFreeQuantityWithoutCreatedBrew());
                }
            }
        }
        return $this->setPaginateToView($orders, $this);
    }

    /**
     * @Route("/order/{id}",
     *  name="api_order_patch",
     *  methods={"PATCH"},
     *  requirements={
     *      "id": "\d+"
     * })
     * 
     * @SWG\Patch(
     *     summary="Mise à jour d'une partie du brassin. Les champs manquants ne sont pas modifiés.",
     *     consumes={"application/json"},
     *     produces={"application/json"},
     *     @SWG\Response(
     *          response=204,
     *          description="La mise à jour s'est terminée avec succès."
     *     ),
     *     @SWG\Response(
     *          response=422,
     *          description="Le JSON n'est pas correct ou il y a un problème avec un champs.<BR/>
     * Regarde la réponse pour avoir plus d'information."
     *     ),
     *     @SWG\Parameter(
     *          name="JSON du Stock",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(ref=@Model(type=Order::class)),
     *          description="Une partie d'une ligne du brassin."
     *     ),
     *     @SWG\Response(
     *          response=404,
     *          description="Le brassin n'a pas été trouvée."
     *     ),
     *     @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          type="string",
     *          description="L'ID utilisé pour retrouver la ligne du brassin."
     *     )
     * )
     * @param string $id
     * @param Request $request
     * @return View|JsonResponse
     * @throws ExceptionInterface
     */
    public function patchAction(Request $request, string $id)
    {
        return $this->putOrPatch($this->getDataFromJson($request, true), false, $id);
    }

    /**
     * @param array $data
     * @param string $id
     * @param bool $clearMissing
     * @return View|JsonResponse
     * @throws ExceptionInterface
     * @throws Exception
     */
    public function putOrPatch(array $data, bool $clearMissing, string $id)
    {
        $existing = $this->getById($id);
        $form = $this->createForm(OrderType::class, $existing);

        $form->submit($data, $clearMissing);
        $this->validationError($form, $this);
        $this->entityManager->flush();

        return $this->view(null, Response::HTTP_NO_CONTENT);
    }

    /**
     * @Route("/order/{id}",
     *  name="api_order_delete",
     *  methods={"DELETE"},
     *  requirements={
     *      "id": "\d+"
     * })
     * 
     * @SWG\Delete(
     *     summary="Supprime la ligne du brassin de la base de données. Ne peut pas être annulé.",
     *     @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          type="string",
     *          description="L'ID utilisé pour retrouver la ligne du brassin."
     *     )
     * )
     * @SWG\Response(
     *     response=204,
     *     description="La ligne du brassin a bien été supprimée."
     * )
     *
     * @SWG\Response(
     *     response=404,
     *     description="La ligne du brassin n'existe pas."
     * )
     *
     * @param string $id
     * @throws Exception
     * @return View|JsonResponse
     */
    public function deleteAction(string $id)
    {
        $existing = $this->getById($id);

        $this->entityManager->remove($existing);
        $this->entityManager->flush();
        return $this->view(null, Response::HTTP_NO_CONTENT);
    }

    /**
     * @param string $id
     *
     * @return Order
     * @throws NotFoundHttpException
     */
    private function getById(string $id)
    {
        $order = $this->repository->find($id);
        if (null === $order) {
            throw new NotFoundHttpException();
        }
        return $order;
    }

    /**
     * @param string $id
     *
     * @return Brew
     * @throws NotFoundHttpException
     */
    private function getBrewById(string $id)
    {
        $brew = $this->brewRepository->find($id);
        if (null === $brew) {
            throw new NotFoundHttpException();
        }
        return $brew;
    }
}
