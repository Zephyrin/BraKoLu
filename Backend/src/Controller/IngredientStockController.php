<?php

namespace App\Controller;

use App\Controller\Helpers\HelperController;
use App\Repository\IngredientStockRepository;

use FOS\RestBundle\Controller\AbstractFOSRestController;
use Symfony\Component\Routing\Annotation\Route;
use Swagger\Annotations as SWG;
use Doctrine\ORM\EntityManagerInterface;
use App\Serializer\FormErrorSerializer;

/**
 * Class IngredientStockController
 * @package App\Controller
 *
 * @Route("api")
 * @SWG\Tag(
 *     name="IngredientStock"
 * )
 * 
 */
class IngredientStockController extends AbstractFOSRestController
{
    use HelperController;

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

    public function __construct(
        EntityManagerInterface $entityManager,
        IngredientStockRepository $ingredientStockRepository,
        FormErrorSerializer $formErrorSerializer
    ) {
        $this->entityManager = $entityManager;
        $this->ingredientStockRepository = $ingredientStockRepository;
        $this->formErrorSerializer = $formErrorSerializer;
    }
}
