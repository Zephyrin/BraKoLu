<?php

namespace App\EventListener;

use App\Exception\JsonException;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class ApiExceptionSubscriber
{
    public function onKernelException(ExceptionEvent $event)
    {
        $e = $event->getThrowable();
        if (!$e instanceof JsonException) {
            return;
        }
        $apiProblem = $e->getResponse();
        $apiProblem->headers->set('Content-Type', 'application/problem+json');
        $event->setResponse($apiProblem);
    }
    public static function getSubscribedEvents()
    {
        return array(
            KernelEvents::EXCEPTION => 'onKernelException'
        );
    }
}
