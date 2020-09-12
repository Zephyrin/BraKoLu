<?php

namespace App\Form;

use Symfony\Component\Form\FormBuilderInterface;

trait HelperIngredientType
{
    public function buildFormIngredient(
        FormBuilderInterface $builder,
        array $options
    ) {
        $builder
            ->add('id')
            ->add('name')
            ->add('comment')
            ->add('unit')
            ->add('unitFactor');
    }
}
