<?php

namespace App\Controller;

use App\Controller\Helpers\HelperController;
use App\Entity\OrderQuantity;
use App\Repository\OrderQuantityRepository;
use App\Form\OrderQuantityType;
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
 * Class OrderQuantityController
 * @package App\Controller
 *
 * @Route("api")
 * @SWG\Tag(name="OrderQuantity")
 * 
 */
class OrderQuantityController extends AbstractFOSRestController
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
     * @var OrderQuantityRepository
     */
    private $repository;

    /**
     * @var FormErrorSerializer
     */
    private $formErrorSerializer;

    public function __construct(
        EntityManagerInterface $entityManager,
        OrderQuantityRepository $repository,
        FormErrorSerializer $formErrorSerializer
    ) {
        $this->entityManager = $entityManager;
        $this->repository = $repository;
        $this->formErrorSerializer = $formErrorSerializer;
    }

    /**
     * @Route("/orderQuantity",
     *  name="api_orderQuantity_post",
     *  methods={"POST"}
     * )
     * 
     * @SWG\Post(
     *  consumes={"application/json"},
     *  produces={"application/json"},
     *  summary="Crée un nouvel ordre d'achat",
     *  @SWG\Response(
     *      response=201,
     *      description="L'ordre d'achat a bien été inséré",
     *      @SWG\Schema(ref=@Model(type=OrderQuantity::class))
     *  ),
     *  @SWG\Response(
     *      response=422,
     *      description="Le JSON comporte une erreur.<br/>Regarde la réponse, elle en dira plus."
     *  ),
     *  @SWG\Parameter(
     *      name="L'ordre d'achat au format JSON",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(ref=@Model(type=OrderQuantity::class))
     *  )
     * )
     * @param Request $request
     * @return View|JsonResponse
     * @throws ExceptionInterface
     */
    public function postAction(Request $request)
    {
        $data = $this->getDataFromJson($request, true);

        $newEntity = new OrderQuantity();
        $form = $this->createForm(OrderQuantityType::class, $newEntity);
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
     * @Route("/orderQuantity/{id}",
     *  name="api_orderQuantity_get",
     *  methods={"GET"},
     *  requirements={
     *      "id": "\d+"
     * })
     * 
     * @SWG\Get(
     *     summary="Donne les informations de l'ordre d'achat",
     *     produces={"application/json"}
     * )
     * @SWG\Response(
     *     response=200,
     *     description="L'ordre d'achat a bien été trouvé.",
     *     @SWG\Schema(ref=@Model(type=OrderQuantity::class))
     * )
     *
     * @SWG\Response(
     *     response=404,
     *     description="L'ordre d'achat n'existe pas encore."
     * )
     * @param string $id
     * @return View
     */
    public function getAction(string $id)
    {
        return $this->view($this->getById($id));
    }

    /**
     * @Route("/orderQuantitys",
     *  name="api_orderQuantity_gets",
     *  methods={"GET"})
     * 
     * @SWG\Get(
     *     summary="Retourne la liste de tout les ordres d'achats en fonction des paramètres de recherche et de pagination. ",
     *     produces={"application/json"}
     * )
     * @SWG\Response(
     *     response=200,
     *     description="Retourne une JSON liste de tout les ordres d'achats.",
     *     @SWG\Schema(ref=@Model(type=OrderQuantity::class))
     * )
     *
     * @QueryParam(name="page"
     *      , requirements="\d+"
     *      , default="1"
     *      , description="La page en cours.")
     * @QueryParam(name="limit"
     *      , requirements="\d+"
     *      , default="0"
     *      , description="Le nombre de ligne de client à retourner dans la liste. 0 pour tous.")
     * @QueryParam(name="sort"
     *      , requirements="(asc|desc)"
     *      , allowBlank=false
     *      , default="asc"
     *      , description="La direction du tri.")
     * @QueryParam(name="sortBy"
     *      , requirements="(id|name)"
     *      , default="name"
     *      , description="Le tri est organisé sur les attributs de la classe orderQuantity.")
     * @QueryParam(name="search"
     *      , nullable=true
     *      , description="Recherche dans la base sur les attributs de la classe orderQuantity.")
     *
     * @param ParamFetcher $paramFetcher
     * @return View
     */
    public function getAllAction(ParamFetcher $paramFetcher)
    {
        $orderQuantitys = $this->repository->findAllPagination($paramFetcher);
        return $this->setPaginateToView($orderQuantitys, $this);
    }

    /**
     * @Route("/orderQuantity/{id}",
     *  name="api_orderQuantity_patch",
     *  methods={"PATCH"},
     *  requirements={
     *      "id": "\d+"
     * })
     * 
     * @SWG\Patch(
     *     summary="Mise à jour d'une partie de l'ordre d'achat. Les champs manquants ne sont pas modifiés.",
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
     *          @SWG\Schema(ref=@Model(type=OrderQuantity::class)),
     *          description="Une partie d'une ligne de l'ordre d'achat."
     *     ),
     *     @SWG\Response(
     *          response=404,
     *          description="L'ordre d'achat n'a pas été trouvée."
     *     ),
     *     @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          type="string",
     *          description="L'ID utilisé pour retrouver la ligne de l'ordre d'achat."
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
        $form = $this->createForm(OrderQuantityType::class, $existing);

        $form->submit($data, $clearMissing);
        $this->validationError($form, $this);
        $this->entityManager->flush();

        return $this->view(null, Response::HTTP_NO_CONTENT);
    }

    /**
     * @Route("/orderQuantity/{id}",
     *  name="api_orderQuantity_delete",
     *  methods={"DELETE"},
     *  requirements={
     *      "id": "\d+"
     * })
     * 
     * @SWG\Delete(
     *     summary="Supprime la ligne de l'ordre d'achat de la base de données. Ne peut pas être annulé.",
     *     @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          type="string",
     *          description="L'ID utilisé pour retrouver la ligne de l'ordre d'achat."
     *     )
     * )
     * @SWG\Response(
     *     response=204,
     *     description="La ligne de l'ordre d'achat a bien été supprimée."
     * )
     *
     * @SWG\Response(
     *     response=404,
     *     description="La ligne de l'ordre d'achat n'existe pas."
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
     * @return OrderQuantity
     * @throws NotFoundHttpException
     */
    private function getById(string $id)
    {
        $orderQuantity = $this->repository->find($id);
        if (null === $orderQuantity) {
            throw new NotFoundHttpException();
        }
        return $orderQuantity;
    }
}