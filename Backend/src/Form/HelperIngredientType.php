<?php

namespace App\Form;

use App\Entity\IngredientStock;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;

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
            ->add('unitFactor')
            ->add(
                'ingredientStock',
                EntityType::class,
                ['class' => IngredientStock::class, 'required' => false]
            );
    }
}
