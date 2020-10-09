<?php

namespace App\Controller\Enums;

use App\Entity\Ingredients\Cereal;

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
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpKernel\Exception\PreconditionFailedHttpException;

/**
 * Class EnumCerealController
 * @package App\Controller\Enums
 * 
 * @Route("api/ingredients/cereal/enum")
 * @SWG\Tag(name="Cereal's enums")
 */
class EnumCerealController extends AbstractFOSRestController
{

    /**
     * @Route("/{name}",
     *  name="api_enum_cereal_format_get",
     *  methods={"GET"},
     *  requirements={
     *      "name": "(formats|types)"
     *  }
     * )
     * 
     * @SWG\Get(
     *  summary="Récupère les valeurs possible de l'enum Cereal::FORMATS ou de Cereal::TYPES. Ce sont les valeurs qui 
     * pourront être utilisées pour les attributs format ou type.",
     *  produces={"application/json"},
     *  @SWG\Parameter(
     *          name="name",
     *          type="string",
     *          required=false,
     *          description="Le nom de l'attribut dont on souhaite récupérer la liste des valeur: possibles: formats ou types.",
     *          in="path"
     *      )
     * )
     * @SWG\Response(
     *  response=200,
     *  description="L'enum a bien été récupéré.",
     *  @SWG\Schema(type="array",
     *      @SWG\Items(type="enum", enum="{'{malt,cru}', '{grain, flocon}', '{...}'}"))
     * )
     * @param string $name
     * @return View
     */
    public function getAction(string $name)
    {
        switch ($name) {
            case 'formats':
                return $this->view(Cereal::FORMATS);
            case 'types':
                    return $this->view(Cereal::TYPES);
            default:
                break;
        }        
    }
}
