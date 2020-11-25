<?php

namespace App\Controller;

use App\Controller\Helpers\HelperController;
use App\Entity\Brew;
use App\Repository\BrewRepository;
use App\Form\BrewIngredientType;
use App\Controller\Helpers\HelperForwardController;
use App\Entity\BrewIngredient;
use App\Repository\BrewIngredientRepository;
use App\Serializer\FormErrorSerializer;

use FOS\RestBundle\Controller\AbstractFOSRestController;
use Symfony\Component\Routing\Annotation\Route;
use Swagger\Annotations as SWG;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Nelmio\ApiDocBundle\Annotation\Model;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Component\HttpKernel\Exception\PreconditionFailedHttpException;
use DateTime;
use Exception;

/**
 * Class BrewIngredientsController
 * @package App\Controller
 *
 * @Route("api")
 * @SWG\Tag(name="Brew's ingredients")
 * 
 */
class BrewIngredientController extends AbstractFOSRestController
{
    /**
     * Utilise les fonctionnalités écritent dans HelperController.
     */
    use HelperController;

    /**
     * Utilise le helper pour envoyer aux autres controllers.
     */
    use HelperForwardController;

    /**
     * @var EntityManagerInterface
     */
    private $entityManager;
    /**
     * @var BrewIngredientRepository
     */
    private $repository;

    /**
     * @var BrewRepository
     */
    private $brewRepository;

    /**
     * @var FormErrorSerializer
     */
    private $formErrorSerializer;

    private $brew = 'brew';
    private $ingredient = 'ingredient';

    public function __construct(
        EntityManagerInterface $entityManager,
        BrewRepository $brewRepository,
        BrewIngredientRepository $repository,
        FormErrorSerializer $formErrorSerializer
    ) {
        $this->entityManager = $entityManager;
        $this->brewRepository = $brewRepository;
        $this->repository = $repository;
        $this->formErrorSerializer = $formErrorSerializer;
    }

    /**
     * @Route("/brew/{id}/ingredient",
     *  name="api_brew_ingredient_post",
     *  methods={"POST"},
     *  requirements={
     *      "id": "\d+"
     * })
     * 
     * @SWG\Post(
     *  consumes={"application/json"},
     *  produces={"application/json"},
     *  summary="Ajoute un ingredient au brassin",
     *  @SWG\Response(
     *      response=201,
     *      description="L'ingrédient a bien été inséré",
     *      @SWG\Schema(ref=@Model(type=Brew::class))
     *  ),
     *  @SWG\Response(
     *      response=422,
     *      description="Le JSON comporte une erreur.<br/>Regarde la réponse, elle en dira plus."
     *  ),
     *  @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          type="string",
     *          description="L'ID utilisé pour retrouver l'ingrédient'."
     *  ),
     *  @SWG\Parameter(
     *      name="L'ingredient au format JSON",
     *      in="body",
     *      required=true,
     *      @SWG\Schema(ref=@Model(type=Brew::class))
     *  )
     * )
     * @param Request $request
     * @return View|JsonResponse
     * @throws ExceptionInterface
     */
    public function postAction(Request $request, string $id)
    {
        $data = $this->getDataFromJson($request, true);
        $brew = $this->getBrewById($id);
        $response[] = $this->createOrUpdate($data, $this->brew, "BrewController", false, false);
        $response[] = $this->createOrUpdate($data, $this->ingredient, "IngredientController", false, false);
        $newEntity = new BrewIngredient();
        $newEntity->setBrew($brew);
        $form = $this->createForm(BrewIngredientType::class, $newEntity);
        $form->submit($data, false);
        $this->validationError(
            $form,
            $this,
            $response
        );
        $insertData = $form->getData();
        $this->entityManager->persist($insertData);

        $this->entityManager->flush();
        return $this->view($insertData, Response::HTTP_CREATED);
    }

    /**
     * @Route("/brew/{brewId}/ingredient/{id}",
     *  name="api_brew_ingredient_patch",
     *  methods={"PATCH"},
     *  requirements={
     *      "id": "\d+",
     *      "brewId": "\d+"
     * })
     * 
     * @SWG\Patch(
     *     summary="Mise à jour d'un ingrédient de brassin. Uniquement sa quantité peut-être mise à jour,
     *  si le brassin n'est pas dans l'état Conditionnement, Complete ou Archivé",
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
     *          description="Une partie d'un ingrédient de brassin."
     *     ),
     *     @SWG\Response(
     *          response=404,
     *          description="Le brassin ou l'ingredient du brassin n'a pas été trouvée."
     *     ),
     *     @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          type="string",
     *          description="L'ID utilisé pour retrouver l'ingrédient'."
     *     ),
     *     @SWG\Parameter(
     *          name="brewId",
     *          in="path",
     *          type="string",
     *          description="L'ID utilisé pour retrouver le brassin."
     *     )
     * )
     * @param string $id
     * @param Request $request
     * @return View|JsonResponse
     * @throws ExceptionInterface
     */
    public function patchAction(Request $request, string $brewId, string $id)
    {
        return $this->putOrPatch($this->getDataFromJson($request, true), false, $brewId, $id);
    }

    /**
     * @param array $data
     * @param string $id
     * @param string $brewId
     * @param bool $clearMissing
     * @return View|JsonResponse
     * @throws ExceptionInterface
     * @throws Exception
     */
    public function putOrPatch(array $data, bool $clearMissing, string $brewId, string $id)
    {
        $existing = $this->getById($id);
        $brew = $this->getBrewById($brewId);
        if ($brew->getState() == 'complete' || $brew->getState() == 'archived') {
            throw new Exception('Le brassin n\'est pas dans un état qui permet la modification', 422);
        }
        $form = $this->createForm(BrewIngredientType::class, $existing);
        // Suppression des liens avec les autres objets qui ne peuvent pas être mise à jour par cet élément.
        if (isset($data[$this->brew])) unset($data[$this->brew]);
        if (isset($data[$this->ingredient])) unset($data[$this->ingredient]);

        $form->submit($data, $clearMissing);
        $this->validationError($form, $this);
        $this->entityManager->flush();

        return $this->view(null, Response::HTTP_NO_CONTENT);
    }

    /**
     * @Route("/brew/{brewId}/ingredient/{id}",
     *  name="api_brew_ingredient_delete",
     *  methods={"DELETE"},
     *  requirements={
     *      "id": "\d+",
     *      "brewId": "\d+"
     * })
     * 
     * @SWG\Delete(
     *     summary="Supprime l'ingrédient du brassin et le ingredient si le brassin est en creation ou validé. Ne peut pas être annulé.",
     *     @SWG\Parameter(
     *          name="id",
     *          in="path",
     *          type="string",
     *          description="L'ID utilisé pour retrouver l'ingrédient du brassin."
     *     ),
     *     @SWG\Parameter(
     *          name="brewId",
     *          in="path",
     *          type="string",
     *          description="L'ID utilisé pour retrouver le brassin."
     *     )
     * )
     * @SWG\Response(
     *     response=204,
     *     description="L'ingrédient a bien été supprimée."
     * )
     *
     * @SWG\Response(
     *     response=404,
     *     description="L'ingredient n'existe pas."
     * )
     *
     * @param string $id
     * @param string $brewId
     * @throws Exception
     * @return View|JsonResponse
     */
    public function deleteAction(string $brewId, string $id)
    {
        $existing = $this->getById($id);
        $brew = $this->getBrewById($brewId);
        if ($brew->getState() == 'archived' || $brew->getState() == 'complete') {
            throw new Exception("L'état du brassin ne permet plus de modifier ");
        }
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
     * @return BrewIngredient
     * @throws NotFoundHttpException
     */
    private function getById(string $id)
    {
        $value = $this->repository->find($id);
        if (null === $value) {
            throw new NotFoundHttpException();
        }
        return $value;
    }
}
