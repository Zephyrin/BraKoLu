<?php

namespace App\Exception;

use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpFoundation\JsonResponse;

class JsonException extends HttpException
{
    private $jsonException;
    public function __construct(JsonResponse $apiProblem, \Exception $previous = null, array $headers = array())
    {
        $this->apiProblem = $apiProblem;
        $statusCode = $apiProblem->getStatusCode();
        parent::__construct($statusCode, "", $previous, $headers, 1);
    }
    public function getResponse()
    {
        return $this->apiProblem;
    }
}
