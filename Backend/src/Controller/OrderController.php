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
use App\Entity\Ingredient;
use App\Repository\BrewRepository;
use App\Repository\BrewStockRepository;
use App\Repository\IngredientStockRepository;
use App\Repository\IngredientRepository;
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
     * @var BrewStockRepository
     */
    private $brewStockRepository;
    /**
     * @var IngredientStockRepository
     */
    private $stockRepository;
    /**
     * @var IngredientRepository
     */
    private $ingredientRepository;
    /**
     * @var FormErrorSerializer
     */
    private $formErrorSerializer;

    public function __construct(
        EntityManagerInterface $entityManager,
        OrderRepository $repository,
        BrewRepository $brewRepository,
        BrewStockRepository $brewStockRepository,
        IngredientStockRepository $stockRepository,
        IngredientRepository $ingredientRepository,
        FormErrorSerializer $formErrorSerializer
    ) {
        $this->entityManager = $entityManager;
        $this->repository = $repository;
        $this->brewRepository = $brewRepository;
        $this->brewStockRepository = $brewStockRepository;
        $this->stockRepository = $stockRepository;
        $this->ingredientRepository = $ingredientRepository;
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
        return $this->setPaginateToView($orders, $this);
    }

    /**
     * @Route("/order/{id}/changeState",
     *  name="api_order_change_state_patch",
     *  methods={"PATCH"},
     *  requirements={
     *      "id": "\d+"
     * })
     * 
     * @SWG\Patch(
     *     summary="Change l'état de la commande et du stock dans la foulée.",
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
     *     @SWG\Response(
     *          response=404,
     *          description="Quelque chose n'a pas été trouvé. Comme la commande, le stock, l'ingrédient, le brassin..."
     *     ),
     *     @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          type="string",
     *          description="L'ID utilisé pour retrouver la ligne de la commande."
     *     )
     * )
     * @param string $id
     * @param Request $request
     * @return View|JsonResponse
     * @throws ExceptionInterface
     */
    public function patchOrderChangeState(Request $request, string $id)
    {
        $order = $this->getById($id);
        if ($order->getState() == 'received') {
            $this->createConflictError("La commande ne peut-être modifiée car elle est déjà reçue.");
        }
        $state = $order->getState();
        if ($state == 'created') {
            $order->setState('ordered');
            $state = 'ordered';
        } else if ($state === 'ordered') {
            $order->setState('received');
            $state = 'stocked';
        }
        foreach ($order->getStocks() as $stock) {
            $stock->setState($state);
            $stock->setOrderedDate(new DateTime('now'));
        }
        $this->entityManager->persist($order);
        $this->entityManager->flush();
        return $this->view($order, Response::HTTP_OK);
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
        foreach ($existing->getStocks() as $stock) {
            $this->entityManager->remove($stock);
        }
        $this->entityManager->remove($existing);
        $this->entityManager->flush();
        return $this->view(null, Response::HTTP_NO_CONTENT);
    }

    /**
     * @Route("/order/{id}/deleteIngredient/{idIngredient}",
     *  name="api_order_ingredient_stock_delete",
     *  methods={"DELETE"},
     *  requirements={
     *      "id": "\d+",
     *      "idIngredient": "\d+"
     * })
     * 
     * @SWG\Delete(
     *     summary="Supprime l'ingrédient de la commande. Ne peut pas être annulé.",
     *     @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          type="string",
     *          description="L'ID utilisé pour retrouver la ligne du brassin."
     *     ),
     *      @SWG\Parameter(
     *          name="idIngredient",
     *          in="path",
     *          type="string",
     *          description="L'ID utilisé pour retrouver l'ingrédient stock de la commande."
     *     )
     * )
     * @SWG\Response(
     *     response=204,
     *     description="L'ingrédient stock a bien été supprimer du stock."
     * )
     *
     * @SWG\Response(
     *     response=404,
     *     description="La ligne du brassin n'existe pas ou l'ingrédient stock."
     * )
     *
     * @param string $id
     * @param string $idIngredient
     * @throws Exception
     * @return View|JsonResponse
     */
    public function deleteIngredientStockAction(string $id, string $idIngredient)
    {
        $order = $this->getById($id);
        $ingredientStock = $this->getIngredientStockById($idIngredient);
        if ($order->getId() != $ingredientStock->getOrder()->getId())
            $this->createConflictError("L'ingredient stock n'appartient pas à la commande");

        $this->entityManager->remove($ingredientStock);
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

    /**
     * @param string $id
     *
     * @return BrewStock
     * @throws NotFoundHttpException
     */
    private function getBrewStokById(string $id)
    {
        $brew = $this->brewStockRepository->find($id);
        if (null === $brew) {
            throw new NotFoundHttpException();
        }
        return $brew;
    }

    /**
     * @param string $id
     *
     * @return Ingredient
     * @throws NotFoundHttpException
     */
    private function getIngredientById(string $id)
    {
        $value = $this->ingredientRepository->find($id);
        if (null === $value) {
            throw new NotFoundHttpException();
        }
        return $value;
    }

    /**
     * @param string $id
     *
     * @return IngredientStock
     * @throws NotFoundHttpException
     */
    private function getIngredientStockById(string $id)
    {
        $value = $this->stockRepository->find($id);
        if (null === $value) {
            throw new NotFoundHttpException();
        }
        return $value;
    }
}
