<?php

namespace App\Tests\Behat;

use Imbo\BehatApiExtension\Context\ApiContext;
use PHPUnit\Framework\Assert;

class ApiContextAuth extends ApiContext
{
    public function theResponseBodyHasFields($nbField)
    {
        $this->requireResponse();

        $body = $this->getResponseBody();
        Assert::assertEquals($nbField, count((array) $body));
    }

    public function thenISaveThe($value)
    {
        $this->requireResponse();
        $body = $this->getResponseBody();
        $this->savedValue[$value] = ((array) $body)[$value];
    }

    public function thenISaveTheAs($value, $name)
    {
        $this->requireResponse();
        $body = $this->getResponseBody();
        $this->savedValue[$name] = ((array) $body)[$value];
    }

    public function getSavedValue($field)
    {
        return $this->savedValue[$field];
    }
}
