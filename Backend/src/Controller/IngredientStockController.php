<?php

namespace App\Controller;

use App\Controller\Helpers\HelperController;
use App\Entity\IngredientStock;
use App\Repository\IngredientStockRepository;
use App\Form\IngredientStockType;
use App\Controller\Helpers\HelperForwardController;
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
 * Class IngredientStockController
 * @package App\Controller
 *
 * @Route("api")
 * @SWG\Tag(name="IngredientStock")
 * 
 */
class IngredientStockController extends AbstractFOSRestController
{
    use HelperController;

    use HelperForwardController;

    /**
     * @var EntityManagerInterface
     */
    private $entityManager;
    /**
     * @var IngredientStockRepository
     */
    private $ingredientStockRepository;

    /**
     * @var FormErrorSerializer
     */
    private $formErrorSerializer;

    private $ingredient = "ingredient";
    private $creationDate = "creationDate";

    public function __construct(
        EntityManagerInterface $entityManager,
        IngredientStockRepository $ingredientStockRepository,
        FormErrorSerializer $formErrorSerializer
    ) {
        $this->entityManager = $entityManager;
        $this->ingredientStockRepository = $ingredientStockRepository;
        $this->formErrorSerializer = $formErrorSerializer;
    }

    /**
     * @Route("/ingredient/stock",
     *  name="api_ingredient_stock_post",
     *  methods={"POST"}
     * )
     * 
     * @SWG\Post(
     *  consumes={"application/json"},
     *  produces={"application/json"},
     *  summary="Crée un nouvel ingrédient dans le stock",
     *  @SWG\Response(
     *      response=201,
     *      description="L'ingrédient dans le stock a bien été inséré",
     *      @SWG\Schema(ref=@Model(type=IngredientStock::class))
     *  ),
     *  @SWG\Response(
     *      response=422,
     *      description="Le JSON comporte une erreur.<br/>Regarde la réponse, elle en dira plus."
     *  ),
     *  @SWG\Response(
     *      response=404,
     *      description="L'ingrédient n'existe pas."
     *  ),
     *  @SWG\Parameter(
     *      name="Le stock d'ingrédient au format JSON",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(ref=@Model(type=IngredientStock::class))
     *  )
     * )
     * @param Request $request
     * @return View|JsonResponse
     * @throws ExceptionInterface
     */
    public function postAction(Request $request)
    {
        $data = $this->getDataFromJson($request, true);

        if ($data instanceof JsonResponse)
            return $data;
        $responseIngredient = $this->createOrUpdateIngredient($data, $this->ingredient);
        $newEntity = new IngredientStock();
        $newEntity->setCreationDate(new DateTime());
        $form = $this->createForm(IngredientStockType::class, $newEntity);
        $form->submit($data, false);
        $this->validationErrorWithChild(
            $form,
            $this,
            $responseIngredient,
            $this->ingredient
        );
        $insertData = $form->getData();
        $this->entityManager->persist($insertData);

        $this->entityManager->flush();
        return $this->view($insertData, Response::HTTP_CREATED);
    }

    /**
     * @Route("/ingredient/stock/{id}",
     *  name="api_ingredient_stock_get",
     *  methods={"GET"},
     *  requirements={
     *      "id": "\d+"
     * })
     * 
     * @SWG\Get(
     *     summary="Donne les informations du stock d'un ingrédient ",
     *     produces={"application/json"}
     * )
     * @SWG\Response(
     *     response=200,
     *     description="Le stock a bien été trouvé.",
     *     @SWG\Schema(ref=@Model(type=IngredientStock::class))
     * )
     *
     * @SWG\Response(
     *     response=404,
     *     description="Le stock n'existe pas encore."
     * )
     * @param string $id
     * @return View
     */
    public function getAction(string $id)
    {
        $ingredient = $this->getById($id);
        return $this->view($ingredient);
    }

    /**
     * @Route("/ingredient/stocks",
     *  name="api_ingredient_stock_gets",
     *  methods={"GET"})
     * 
     * @SWG\Get(
     *     summary="Retourne la liste de tout le stock.",
     *     produces={"application/json"}
     * )
     * @SWG\Response(
     *     response=200,
     *     description="Retourne une JSON liste de tout le stock.",
     *     @SWG\Schema(ref=@Model(type=IngredientStock::class))
     * )
     *
     * @QueryParam(name="page"
     *      , requirements="\d+"
     *      , default="1"
     *      , description="La page en cours.")
     * @QueryParam(name="limit"
     *      , requirements="\d+"
     *      , default="0"
     *      , description="Le nombre de ligne du stock d'ingrédient à retourner dans la liste. 0 pour tous.")
     * @QueryParam(name="sort"
     *      , requirements="(asc|desc)"
     *      , allowBlank=false
     *      , default="asc"
     *      , description="La direction du tri.")
     * @QueryParam(name="sortBy"
     *      , requirements="(id|creationDate|quantity|price|state|orderedDate|receivedDate|endedDate|ingredient.id|ingredient.name|ingredient.comment|ingredient.unit|ingredient.unitFactor)"
     *      , default="name"
     *      , description="Le tri est organisé sur les attributs de la classe et de la classe liée ingredient.")
     * @QueryParam(name="search"
     *      , nullable=true
     *      , description="Recherche dans la base sur les attributs de la classe et de la classe liée ingrédient.")
     *
     * @param ParamFetcher $paramFetcher
     * @return View
     */
    public function getAllAction(ParamFetcher $paramFetcher)
    {
        $ingredients = $this->ingredientRepository->findAllPagination($paramFetcher);
        return $this->setPaginateToView($ingredients, $this);
    }

    /**
     * @Route("/ingredient/stock/{id}",
     *  name="api_ingredient_stock_patch",
     *  methods={"PATCH"},
     *  requirements={
     *      "id": "\d+"
     * })
     * 
     * @SWG\Patch(
     *     summary="Mise à jour d'une partie du stock. Les champs manquants ne sont pas modifiés.",
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
     *          @SWG\Schema(ref=@Model(type=IngredientStock::class)),
     *          description="Une partie d'une ligne du stock."
     *     ),
     *     @SWG\Response(
     *          response=404,
     *          description="La ligne du stock n'a pas été trouvée."
     *     ),
     *     @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          type="string",
     *          description="L'ID utilisé pour retrouver la ligne du stock d'ingrédient."
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
        $form = $this->createForm(IngredientStockType::class, $existing);
        unset($data[$this->childName]);
        if ($data instanceof JSonResponse) {
            return $data;
        }

        $form->submit($data, $clearMissing);
        $this->validationError($form, $this);

        $insertData = $form->getData();

        $this->entityManager->flush();

        return $this->view(null, Response::HTTP_NO_CONTENT);
    }

    /**
     * @Route("/ingredient/stock/{id}",
     *  name="api_ingredient_stock_delete",
     *  methods={"DELETE"},
     *  requirements={
     *      "id": "\d+"
     * })
     * 
     * @SWG\Delete(
     *     summary="Supprime la ligne du stock de la base de données. Ne peut pas être annulé.
     *  L'ingrédient associé n'est pas supprimé.",
     *     @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          type="string",
     *          description="L'ID utilisé pour retrouver la ligne du stock."
     *     )
     * )
     * @SWG\Response(
     *     response=204,
     *     description="La ligne du stock a bien été supprimée."
     * )
     *
     * @SWG\Response(
     *     response=404,
     *     description="La ligne du stock n'existe pas."
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
        return $this->view(
            null,
            Response::HTTP_NO_CONTENT
        );
    }

    /**
     * @param string $id
     *
     * @return Ingredient
     * @throws NotFoundHttpException
     */
    private function getById(string $id)
    {
        $ingredient = $this->ingredientStockRepository->find($id);
        if (null === $ingredient) {
            throw new NotFoundHttpException();
        }
        return $ingredient;
    }
}
