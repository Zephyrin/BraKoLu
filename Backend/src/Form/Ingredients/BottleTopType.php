<?php

namespace App\Form\Ingredients;

use App\Entity\Ingredients\BottleTop;
use App\Form\HelperIngredientType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class BottleTopType extends AbstractType
{
    use HelperIngredientType;
    public function buildForm(
        FormBuilderInterface $builder,
        array $options
    ) {
        $this->buildFormIngredient($builder, $options);
        $builder
            ->add("size")
            ->add("color");
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(
            [
                'data_class'         => BottleTop::class,
                'allow_extra_fields' => false,
                'csrf_protection'    => false,
            ]
        );
    }
}