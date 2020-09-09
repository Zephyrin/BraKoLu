<?php

namespace App\Controller;

use App\Entity\Ingredient;
use App\Form\IngredientType;
use App\Repository\IngredientRepository;
use App\Controller\Helpers\HelperController;
use Doctrine\ORM\EntityManagerInterface;
use App\Serializer\FormErrorSerializer;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Swagger\Annotations as SWG;
use Nelmio\ApiDocBundle\Annotation\Model;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\Controller\Annotations\QueryParam;
use JsonException;
use phpDocumentor\Reflection\Types\Integer;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class IngredientController
 * @package App\Controller
 *
 * @Route("api")
 * @SWG\Tag(
 *     name="Ingredient"
 * )
 * 
 */
class IngredientController extends AbstractFOSRestController
{
    use HelperController;

    /**
     * @var EntityManagerInterface
     */
    private $entityManager;
    /**
     * @var IngredientRepository
     */
    private $ingredientRepository;

    /**
     * @var FormErrorSerializer
     */
    private $formErrorSerializer;

    /* Simplify les rennomages de masse. Un seul endroit où changer le nom des champs. */
    private $id = "id";

    private $title = "title";
    private $subtitle = "subtitle";

    public function __construct(
        EntityManagerInterface $entityManager,
        IngredientRepository $ingredientRepository,
        FormErrorSerializer $formErrorSerializer
    ) {
        $this->entityManager = $entityManager;
        $this->ingredientRepository = $ingredientRepository;
        $this->formErrorSerializer = $formErrorSerializer;
    }

    /**
     * @Route("/ingredient",
     *  name="api_ingredient_post",
     *  methods={"POST"}
     *  )
     *
     * @SWG\Post(
     *     consumes={"application/json"},
     *     produces={"application/json"},
     *     summary="Crée un nouvel ingrédient de type Houblon, Levure, Bouteille...",
     *     @SWG\Response(
     *          response=201,
     *          description="Le nouvel ingrédient à bien été inséré.",
     *          @SWG\Schema(ref=@Model(type=Ingredient::class))
     *     ),
     *     @SWG\Response(
     *          response=422,
     *          description="Le JSON comporte une erreur ou l'ingrédient est en conflit avec un autre.<BR/>
     * Regarde la réponse, elle en dira plus."
     *     ),
     *     @SWG\Parameter(
     *          name="L'Ingredient au format JSON",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(ref=@Model(type=Ingredient::class))
     *    )
     * )
     *
     * @param Request $request
     * @return View|JsonResponse
     * @throws ExceptionInterface
     */
    public function postAction(Request $request)
    {
        $data = $this->getDataFromJson($request, true);

        if ($data instanceof JsonResponse)
            return $data;

        $form = $this->createForm(IngredientType::class, new Ingredient());
        $form->submit($data, false);
        $validation = $this->validationError($form, $this);
        if ($validation instanceof JsonResponse) {
            return $validation;
        }
        $insertData = $form->getData();

        $this->entityManager->persist($insertData);

        $this->entityManager->flush();
        return  $this->view($insertData, Response::HTTP_CREATED);
    }

    /**
     * @Route("/ingredient/{id}",
     *  name="api_ingredient_get",
     *  methods={"GET"},
     *  requirements={
     *      "id": "\d+"
     * })
     * 
     * @SWG\Get(
     *     summary="Donne les informations d'un ingrédient",
     *     produces={"application/json"}
     * )
     * @SWG\Response(
     *     response=200,
     *     description="L'ingrédient a bien été trouvé.",
     *     @SWG\Schema(ref=@Model(type=Ingredient::class))
     * )
     *
     * @SWG\Response(
     *     response=404,
     *     description="L'ingrédient n'existe pas encore."
     * )
     * @param string $id
     * @return View
     */
    public function getAction(string $id)
    {
        $ingredient = $this->getIngredientById($id);
        if ($ingredient instanceof JsonResponse)
            return $ingredient;
        return $this->view($ingredient);
    }

    /**
     * @Route("/ingredients",
     *  name="api_ingredient_gets",
     *  methods={"GET"})
     * 
     * @SWG\Get(
     *     summary="Retourne la liste de tout les ingrédients.",
     *     produces={"application/json"}
     * )
     * @SWG\Response(
     *     response=200,
     *     description="Retourne une JSON liste de tout les ingrédients.",
     *     @SWG\Schema(ref=@Model(type=Ingredient::class))
     * )
     *
     * @QueryParam(name="page"
     *      , requirements="\d+"
     *      , default="1"
     *      , description="La page en cours.")
     * @QueryParam(name="limit"
     *      , requirements="\d+"
     *      , default="0"
     *      , description="Le nombre d'ingrédient à retourner dans la liste. 0 pour tous.")
     * @QueryParam(name="sort"
     *      , requirements="(asc|desc)"
     *      , allowBlank=false
     *      , default="asc"
     *      , description="La direction du tri.")
     * @QueryParam(name="sortBy"
     *      , requirements="(id|name|comment|unit|unitFactor)"
     *      , default="name"
     *      , description="Le tri est organiser sur l'id, le nom ou les commentaires.")
     * @QueryParam(name="search"
     *      , nullable=true
     *      , description="Recherche dans la base sur le nom ou les commentaires.")
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
     * @Route("/ingredient/{id}",
     *  name="api_ingredient_patch",
     *  methods={"PATCH"},
     *  requirements={
     *      "id": "\d+"
     * })
     * 
     * @SWG\Patch(
     *     summary="Mise à jour d'une partie d'un ingrédient. Les champs manquants ne sont pas modifiés.",
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
     *          name="JSON Ingrédient",
     *          in="body",
     *          required=true,
     *          @SWG\Schema(ref=@Model(type=Ingredient::class)),
     *          description="Une partie d'un ingrédient."
     *     ),
     *     @SWG\Response(
     *          response=404,
     *          description="L'ingrédient n'a pas été trouvé."
     *     ),
     *     @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          type="string",
     *          description="L'ID utilisé pour retrouver l'ingrédient."
     *     )
     * )
     * @param string $id
     * @param Request $request
     * @return View|JsonResponse
     * @throws ExceptionInterface
     */
    public function putAction(Request $request, string $id)
    {
        return $this->putOrPatch($request, false, $id);
    }

    private function putOrPatch(Request $request, bool $clearData, string $id)
    {
        $existingIngredient = $this->getIngredientById($id);
        if ($existingIngredient instanceof JsonResponse)
            return $existingIngredient;
        $form = $this->createForm(IngredientType::class, $existingIngredient);
        $data = $this->getDataFromJson($request, true);
        if ($data instanceof JSonResponse) {
            return $data;
        }

        $form->submit($data, $clearData);
        $validation = $this->validationError($form, $this);
        if ($validation instanceof JsonResponse) {
            return $validation;
        }
        $insertData = $form->getData();

        $this->entityManager->flush();

        return $this->view(null, Response::HTTP_NO_CONTENT);
    }

    /**
     * @Route("/ingredient/{id}",
     *  name="api_ingredient_delete",
     *  methods={"DELETE"},
     *  requirements={
     *      "id": "\d+"
     * })
     * 
     * @SWG\Delete(
     *     summary="Supprime l'ingrédient de la base de données. Ne peut pas être annulé.",
     *     @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          type="string",
     *          description="L'ID utilisé pour retrouver l'ingrédient."
     *     )
     * )
     * @SWG\Response(
     *     response=204,
     *     description="L'ingrédient n'existe pas."
     * )
     *
     * @SWG\Response(
     *     response=404,
     *     description="The ingredient page doesnot exists."
     * )
     *
     * @param string $id
     * @throws Exception
     * @return View|JsonResponse
     */
    public function deleteAction(string $id)
    {
        $ingredient = $this->getIngredientById($id);
        if ($ingredient instanceof JsonResponse)
            return $ingredient;

        $this->entityManager->remove($ingredient);
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
    private function getIngredientById(string $id)
    {
        $ingredient = $this->ingredientRepository->find($id);
        if (null === $ingredient) {
            throw new NotFoundHttpException();
        }
        return $ingredient;
    }
}
