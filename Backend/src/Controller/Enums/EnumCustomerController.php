<?php

namespace App\Controller\Enums;

use App\Entity\Customer;
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
 * Class EnumCustomerController
 * @package App\Controller\Enums
 * 
 * @Route("api/customer")
 * @SWG\Tag(name="Customer' enums")
 */
class EnumCustomerController extends AbstractFOSRestController
{
    /**
     * @Route("/enum/{name}",
     *  name="api_enum_customer_get",
     *  methods={"GET"},
     *  requirements={
     *      "name": "(headers)"
     * })
     * 
     * @SWG\Get(
     *  summary="Récupère les valeurs possible des énumérations Header d'un client.",
     *  produces={"application/json"},
     *  @SWG\Parameter(
     *          name="name",
     *          type="string",
     *          required=true,
     *          description="On cherche soit la liste des états du client soit la liste de tout les entêtes possible.",
     *          in="path")
     * )
     * @SWG\Response(
     *  response=200,
     *  description="L'enum a bien été récupéré.",
     *  @SWG\Schema(type="array",
     *      @SWG\Items(type="enum", enum="{'{ordered, created}', '{name, quantity}'}"))
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
            case 'headers':
                return $this->view(Customer::HEADERS);
            default:
                break;
        }
        throw new NotFoundException();
    }
}