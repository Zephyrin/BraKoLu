<?php

namespace App\Controller;

use App\Controller\Helpers\HelperController;
use App\Entity\Brew;
use App\Repository\BrewRepository;
use App\Form\BrewType;
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
 * Class BrewController
 * @package App\Controller
 *
 * @Route("api")
 * @SWG\Tag(name="Brew")
 * 
 */
class BrewController extends AbstractFOSRestController
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
     * @var BrewRepository
     */
    private $repository;

    /**
     * @var FormErrorSerializer
     */
    private $formErrorSerializer;

    public function __construct(
        EntityManagerInterface $entityManager,
        BrewRepository $repository,
        FormErrorSerializer $formErrorSerializer
    ) {
        $this->entityManager = $entityManager;
        $this->repository = $repository;
        $this->formErrorSerializer = $formErrorSerializer;
    }

    /**
     * @Route("/brew",
     *  name="api_brew_post",
     *  methods={"POST"}
     * )
     * 
     * @SWG\Post(
     *  consumes={"application/json"},
     *  produces={"application/json"},
     *  summary="Crée un nouveau brassin",
     *  @SWG\Response(
     *      response=201,
     *      description="Le brassin a bien été inséré",
     *      @SWG\Schema(ref=@Model(type=Brew::class))
     *  ),
     *  @SWG\Response(
     *      response=422,
     *      description="Le JSON comporte une erreur.<br/>Regarde la réponse, elle en dira plus."
     *  ),
     *  @SWG\Parameter(
     *      name="Le brassin au format JSON",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(ref=@Model(type=Brew::class))
     *  )
     * )
     * @param Request $request
     * @return View|JsonResponse
     * @throws ExceptionInterface
     */
    public function postAction(Request $request)
    {
        $data = $this->getDataFromJson($request, true);

        $newEntity = new Brew();
        $form = $this->createForm(BrewType::class, $newEntity);
        $form->submit($data, false);
        $this->validationError(
            $form,
            $this
        );
        $insertData = $form->getData();
        $this->entityManager->persist($insertData);

        $this->entityManager->flush();
        return $this->view($insertData, Response::HTTP_CREATED);
    }

    /**
     * @Route("/brew/{id}",
     *  name="api_brew_get",
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
     *     @SWG\Schema(ref=@Model(type=Brew::class))
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
     * @Route("/brews",
     *  name="api_brew_gets",
     *  methods={"GET"})
     * 
     * @SWG\Get(
     *     summary="Retourne la liste de tout les brassins en fonction des paramètres de recherche et de pagination. ",
     *     produces={"application/json"}
     * )
     * @SWG\Response(
     *     response=200,
     *     description="Retourne une JSON liste de tout le stock.",
     *     @SWG\Schema(ref=@Model(type=Brew::class))
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
     *      , requirements="(id|name|abv|ibu|ebc|state|producedQuantity|started|ended|created)"
     *      , default="name"
     *      , description="Le tri est organisé sur les attributs de la classe brew.")
     * @QueryParam(name="search"
     *      , nullable=true
     *      , description="Recherche dans la base sur les attributs de la classe brew.")
     * @QueryParam(name="states"
     *      , nullable=true
     *      , description="Selectionne uniquement ceux dont l'état est dans la liste.")
     *
     * @param ParamFetcher $paramFetcher
     * @return View
     */
    public function getAllAction(ParamFetcher $paramFetcher)
    {
        $brews = $this->repository->findAllPagination($paramFetcher);
        return $this->setPaginateToView($brews, $this);
    }

    /**
     * @Route("/brew/{id}",
     *  name="api_brew_patch",
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
     *          @SWG\Schema(ref=@Model(type=Brew::class)),
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
        $started = false;
        $ended = false;
        $this->manageDates($data);
        if (array_key_exists("started", $data)) {
            $started = $data["started"];
            unset($data["started"]);
        }
        if (array_key_exists("ended", $data)) {
            $ended = $data["ended"];
            unset($data["ended"]);
        }
        $existing = $this->getById($id);
        $form = $this->createForm(BrewType::class, $existing);

        $form->submit($data, $clearMissing);
        if ($existing->getState() == "created") {
            if ($started != false && $started != null) $existing->setState("planed");
        }
        if ($existing->getState() == "planed") {
            if ($started == null) $existing->setState("created");
        }
        $this->validationError($form, $this);
        if ($started != false || is_null($started))
            $existing->setStarted($started);
        if ($ended != false || is_null($ended))
            $existing->setEnded($ended);
        $this->entityManager->flush();

        return $this->view($existing, Response::HTTP_OK);
    }

    /**
     * @Route("/brew/{id}",
     *  name="api_brew_delete",
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
     * @return Brew
     * @throws NotFoundHttpException
     */
    private function getById(string $id)
    {
        $brew = $this->repository->find($id);
        if (null === $brew) {
            throw new NotFoundHttpException();
        }
        return $brew;
    }

    private function manageDates(array &$brew)
    {
        if (isset($brew['started'])) {
            $brew['started'] = DateTime::createFromFormat('Y-m-d H:i', $brew['started']);
        }
        if (isset($brew['ended'])) {
            $brew['ended'] = DateTime::createFromFormat('Y-m-d H:i', $brew['ended']);
        }
    }
}
