<?php

namespace App\Controller\Enums;

use App\Entity\Ingredient;
use App\Entity\Ingredients\Bottle;
use App\Entity\Ingredients\BottleTop;
use App\Entity\Ingredients\Cereal;
use App\Entity\Ingredients\Hop;
use App\Entity\Ingredients\Keg;
use App\Entity\Ingredients\Yeast;
use App\Serializer\FormErrorSerializer;
use Behat\Behat\HelperContainer\Exception\NotFoundException;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Swagger\Annotations as SWG;
use Nelmio\ApiDocBundle\Annotation\Model;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpKernel\Exception\PreconditionFailedHttpException;

/**
 * Class EnumIngredientController
 * @package App\Controller\Enums
 * 
 * @Route("api/ingredients")
 * @SWG\Tag(name="Ingredients' enums")
 */
class EnumIngredientController extends AbstractFOSRestController
{
    /**
     * @Route("/enum/{name}",
     *  name="api_enum_ingredients_get",
     *  methods={"GET"},
     *  requirements={
     *      "name": "(childrenNames|headers)"
     * })
     * 
     * @SWG\Get(
     *  summary="Récupère les valeurs possible des énumérations childName ou Header des ingrédients.",
     *  produces={"application/json"},
     *  @SWG\Parameter(
     *          name="name",
     *          type="string",
     *          required=true,
     *          description="On cherche soit la liste des sous ingrédients soit la liste de tout les entêtes possible.",
     *          in="path")
     * )
     * @SWG\Response(
     *  response=200,
     *  description="L'enum a bien été récupéré.",
     *  @SWG\Schema(type="array",
     *      @SWG\Items(type="enum", enum="{'{bottle,bottleTop}', '{name, unit, unitFactor}'}"))
     * )
     * @SWG\Response(
     *  response=404,
     *  description="L'enum n'a pas été trouvé."
     * )
     * @param string $name
     * @return View
     * @throws NotFoundException
     */
    public function getEnumsAction(string $name)
    {
        switch ($name) {
            case 'childrenNames':
                return $this->view(Ingredient::CHILDREN_NAMES);
            case 'headers':
                return $this->view(Ingredient::HEADERS);
            default:
                break;
        }
        throw new NotFoundException();
    }
    /**
     * @Route("/{childName}/enum/{name}",
     *  name="api_enum_sub_ingredients_get",
     *  methods={"GET"},
     *  requirements={
     *      "childName": "(bottle|bottleTop|box|cereal|hop|keg|other|yeast)",
     *      "name": "(volume|sizes|formats|types|head|categories)"
     *  }
     * )
     * 
     * @SWG\Get(
     *  summary="Récupère les valeurs possible des énumérations des différents sous ingrédients. Ce sont les valeurs qui 
     * pourront être utilisées pour les attributs volume, sizes, formats, types ou head.",
     *  produces={"application/json"},
     *  @SWG\Parameter(
     *          name="childName",
     *          type="string",
     *          required=true,
     *          description="Le nom du sous ingrédient dont on souhaite avoir l'enumération",
     *          in="path"),
     *  @SWG\Parameter(
     *          name="name",
     *          type="string",
     *          required=true,
     *          description="Le nom de l'attribut dont on souhaite récupérer la liste des valeurs.",
     *          in="path"
     *      )
     * )
     * @SWG\Response(
     *  response=200,
     *  description="L'enum a bien été récupéré.",
     *  @SWG\Schema(type="array",
     *      @SWG\Items(type="enum", enum="{'{malt,cru}', '{grain, flocon}', '{...}'}"))
     * )
     * @SWG\Response(
     *  response=404,
     *  description="L'enum de {childName} ou de {name} n'a pas été trouvé."
     * )
     * @param string $childName
     * @param string $name
     * @return View
     */
    public function getAction(string $childName, string $name)
    {
        switch ($childName) {
            case 'bottle':
                switch ($name) {
                    case 'types':
                        return $this->view(Bottle::TYPES);
                    case 'volume':
                        return $this->view(Bottle::VOLUME);
                    default:
                        break;
                }
                break;
            case 'bottleTop':
                switch ($name) {
                    case 'sizes':
                        return $this->view(BottleTop::SIZES);
                    default:
                        break;
                }
                break;
            case 'box':
                break;
            case 'cereal':
                switch ($name) {
                    case 'formats':
                        return $this->view(Cereal::FORMATS);
                    case 'types':
                        return $this->view(Cereal::TYPES);
                    case 'categories':
                        return $this->view(Cereal::CATEGORIES);
                    default:
                        break;
                }
            case 'hop':
                switch ($name) {
                    case 'types':
                        return $this->view(Hop::TYPES);
                    default:
                        break;
                }
                break;
            case 'keg':
                switch ($name) {
                    case 'head':
                        return $this->view(Keg::HEAD);
                    case 'volume':
                        return $this->view(Keg::VOLUME);
                    default:
                        break;
                }
                break;
            case 'other':
                break;
            case 'yeast':
                switch ($name) {
                    case 'types':
                        return $this->view(Yeast::TYPES);
                    default:
                        break;
                }
                break;
            default:
                break;
        }
        return new NotFoundException();
    }
}
