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
}
