<?php

namespace App\Form\Ingredients;

use App\Entity\Ingredients\Hop;
use App\Form\HelperIngredientType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class HopType extends AbstractType
{
    use HelperIngredientType;
    public function buildForm(
        FormBuilderInterface $builder,
        array $options
    ) {
        $this->buildFormIngredient($builder, $options);
        $builder
            ->add("harvestYear")
            ->add("type")
            ->add("acidAlpha");
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(
            [
                'data_class'         => Hop::class,
                'allow_extra_fields' => false,
                'csrf_protection'    => false,
            ]
        );
    }
}