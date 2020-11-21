<?php

namespace App\Controller\Helpers;

use FOS\RestBundle\Controller\AbstractFOSRestController;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Exception;
use Symfony\Component\HttpFoundation\Response;

/**
 * This trait help to transfert a JSON data to the dedicated controller to create
 * the data or update it via a parent container. 
 */
trait HelperForwardController
{
    private $id = 'id';

    public function createOrUpdateIngredient(?array &$data, string $name, bool $clearData = false)
    {
        $response_json = null;
        $response = null;
        if ($data == null)
            return $response;
        if (isset($data[$name]) && isset($data[$name][$this->id])) {
            $id = $data[$name][$this->id];
            unset($data[$name][$this->id]);
            $response = $this->forward(
                "App\Controller\IngredientController::putOrPatch",
                ["data" => $data[$name], "id" => $id, "clearMissing" => $clearData]
            );
            $data[$name] = $id;
        } else if (isset($data[$name]) && $data[$name] != null && !is_int($data[$name])) {
            $response = $this->forward(
                "App\Controller\IngredientController::post",
                ['data' => $data[$name]]
            );
            if ($response->getStatusCode() == 201) {
                $response_json = json_decode($response->getContent(), true);
                if (isset($response_json[$this->id])) {
                    $data[$name] = $response_json[$this->id];
                }
            }
        }
        return $response;
    }

    public function createOrUpdate(?array &$data, string $name, string $controller, bool $clearData = false, bool $request = true)
    {
        $response_json = null;
        $response = null;
        if ($data == null)
            return $response;
        $patch = "App\\Controller\\" . $controller . "::putOrPatch";
        $post = "App\\Controller\\" . $controller . "::post";
        if (isset($data[$name]) && isset($data[$name][$this->id])) {
            $id = $data[$name][$this->id];
            unset($data[$name][$this->id]);
            if ($request)
                $response = $this->forward(
                    $patch,
                    ["data" => $data[$name], "id" => $id, "clearMissing" => $clearData]
                );
            $data[$name] = $id;
        } else if (isset($data[$name]) && $data[$name] != null && !is_int($data[$name])) {
            $response = $this->forward(
                $post,
                ['data' => $data[$name]]
            );
            if ($response->getStatusCode() == 201) {
                $response_json = json_decode($response->getContent(), true);
                if (isset($response_json[$this->id])) {
                    $data[$name] = $response_json[$this->id];
                }
            }
        }
        return [$response, $name];
    }
}
