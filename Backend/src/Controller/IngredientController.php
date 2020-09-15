<?php

namespace App\Controller;

use App\Entity\Ingredient;
use App\Form\Ingredients as TypeClass;
use App\Entity\Ingredients as EntityClass;
use App\Form\IngredientType;
use App\Repository\IngredientRepository;
use App\Controller\Helpers\HelperController;
use Doctrine\ORM\EntityManagerInterface;
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
use Symfony\Component\HttpKernel\Exception\PreconditionFailedHttpException;

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
    /**
     * Utilise les fonctionnalités écritent dans HelperController.
     */
    use HelperController;

    /**
     * Est l'utilitaire d'accès à la base de données.
     * 
     * @var EntityManagerInterface 
     */
    private $entityManager;
    /**
     * Est l'utilitaire spécialisé d'accés à laa base de données pour un ingrédient.
     * Elle comporte principalement la recherche.
     *  
     * @var IngredientRepository
     */
    private $ingredientRepository;

    /* Simplify les rennomages de masse. Un seul endroit où changer le nom des champs. */
    private $childName = "childName";

    /**
     * Le constructeur du controlleur. 
     * J'utilise de l'injection de dépendance en nommant correctement les variables.
     * Symfony va se charger d'instancier si besoin les classes ci-dessous et les passer en
     * argument au controlleur.
     * Je les sauvegarde ensuite dans des variables privée pour les utiliser dans les différentes
     * méthode.
     *
     * @param EntityManagerInterface $entityManager
     * @param IngredientRepository $ingredientRepository
     */
    public function __construct(
        EntityManagerInterface $entityManager,
        IngredientRepository $ingredientRepository
    ) {
        $this->entityManager = $entityManager;
        $this->ingredientRepository = $ingredientRepository;
    }

    /**
     * Cette méthode (postAction) est utilisée lorsque le serveur reçoit une 
     * requête de type HTTP POST sur l'adresse http://URL:PORT/api/ingredient
     * C'est définie avec le \@Route de la classe (api) et le \@Route ci dessous.
     * 
     * Les annotations \@SWG permettent de définir la documentation développeur 
     * sur le serveur http://URL:PORT/api/doc
     * 
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
     *          response=412,
     *          description="Il manque le champs 'childName' qui permet de définir l'ingrédient en un type."
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
     * @param Request $request est la requête reçu par le serveur. On a accès au body et aux headers.
     * @return View est le type de base à retourner pour que le serveur puisse construire la réponse HTTP.
     * @throws ExceptionInterface j'utilise les Exceptions pour envoyer les erreurs aux clients. On verra cette partie 
     * plus tard
     */
    public function postAction(Request $request)
    {
        // $this->getDataFromJson($request, true) est une méthode définie dans le trait HelperController
        // Le trait permet de définir des fonctionnalités qui pourront être utilisées comme si elles
        // étaient présente dans la classe qui utilise le trait via le use HelperController
        return $this->post($this->getDataFromJson($request, true));
    }

    /**
     * Ne dépend plus da la requête. Elle est public car elle pourra être appelée par d'autre controleur
     * pour créer un ingrédient tout en créant son objet. Par exemple le controller IngredientStockController.php
     * utilise cette fonction lorsque dans ces propriétés il y a un ingrédient qui ne possède pas d'ID.
     *
     * @param array $data est un tableau avec des attributs qui doivent avoir les mêmes noms que ceux de la classe
     *  Ingrédient
     * @return void
     */
    public function post(array $data)
    {
        // Ici je crée une form qui permet d'associer les attributs de $data dans un nouvelle objet de type Ingrédient.
        // Ce formulaire utilise aussi un type de formulaire qui lié à la classe va lui permettre de faire la validation
        // des données. Ce formulaire sait si ce champs ne doit pas être null ou tout autre truc que l'on définie dans 
        // le fichier App\Form\IngredientType.php ou les enfants App\Form\Ingredients\*.php et les annotations
        // présentent dans le fichier App\Entity\Ingredient ou les enfants App\Entity\Ingredients\*.php.
        $form = $this->createForm($this->getClassOrInstance($data), $this->getClassOrInstance($data, false));
        // Avant d'associé le tableau de valeur à la classe, je supprime les champs de « travail » tel que le 
        // discriminator qui m'a permit de trouver le type d'ingrédient à instancier. 
        unset($data[$this->childName]);
        // Le formulaire applique les données $data à la classe qui a été créée ci-dessus.
        $form->submit($data, false);
        // Et l'on regarde si le formulaire comporte des erreurs.
        // Si c'est le cas, une exception est levée avec la réponse à l'intérieur. On a pas besoin de tester le retour
        // et le serveur est capable de renvoyer la réponse correctement.
        $this->validationError($form, $this);
        // Permet d'avoir la classe Ingredient instancié avec les données mise à jour lors du submit.
        $insertData = $form->getData();

        // Je dis à l'outil de gestion de la base de données, il faudra sauvegarder cette objet.
        $this->entityManager->persist($insertData);
        // La base de données va sauvegarder en base. Il se peut qu'une ou plusieurs exception saute à se moment là sur 
        // des contraintes que nous n'avons pas pu tester telqu'un champs unique. Le serveur sait encore une fois gérer
        // cette exception.
        // Les données générées automatiquement par la base de données se retrouve dans les objets qui seront 
        // sauvegardées.
        $this->entityManager->flush();
        // Je retourne une nouvelle vue avec dans le body la données créée et le code 201 HTTP CREATED
        return $this->view($insertData, Response::HTTP_CREATED);
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
        $existingIngredient = $this->getIngredientById($id);
        if ($existingIngredient instanceof JsonResponse)
            return $existingIngredient;
        $form = $this->createForm($this->getIngredientType($existingIngredient), $existingIngredient);
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
     *     description="L'ingrédient a bien été supprimé."
     * )
     *
     * @SWG\Response(
     *     response=404,
     *     description="L'ingrédient n'existe pas."
     * )
     *
     * @param string $id
     * @throws Exception
     * @return View|JsonResponse
     */
    public function deleteAction(string $id)
    {
        $ingredient = $this->getIngredientById($id);

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

    /**
     * Retourne le nom de la classe ou une nouvelle instance de la classe à partir
     * des données reçu par le serveur. On regarde le champs discr pour déterminer ça.
     *
     * @param [type] $data les données envoyées par le serveur.
     * @param boolean $isClass Si $isClass = true alors retourne le nom de la 
     *  classe sinon retourne une nouvelle instance de la classe.
     * @return string|Ing\Other|Ing\Cereal
     * @throws PreconditionFailedHttpException
     */
    private function getClassOrInstance($data, bool $isClass = true)
    {
        switch ($data[$this->childName]) {
            case 'other':
                if ($isClass)
                    return TypeClass\OtherType::class;
                return new EntityClass\Other();
            case 'cereal':
                if ($isClass)
                    return TypeClass\CerealType::class;
                return new EntityClass\Cereal();
            default:
                throw new PreconditionFailedHttpException('childName field is needed. RTFD !');
        }
    }

    /**
     * Retourne le formulaire associée à la classe $existingClass déjà instanciée.
     * Permet de savoir quelle validation appliquée sur la classe récupérée dans la base de données.
     *
     * @param Ing\Other|Ing\Cereal $existingClass fait partie des classes qui implémentent la classe App\Entity\Ingredient::class.
     * @return string Le nom de la classe de validation
     * @throws PreconditionFailedHttpException
     */
    private function getIngredientType($existingClass)
    {
        switch (get_class($existingClass)) {
            case "App\Entity\Ingredients\Other":
                return TypeClass\OtherType::class;
            case "App\Entity\Ingredients\Cereal":
                return TypeClass\CerealType::class;
            default:
                throw new PreconditionFailedHttpException('Wrong type. RTFD !');
        }
    }
}
