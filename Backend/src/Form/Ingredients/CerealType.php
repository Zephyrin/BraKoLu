<?php

namespace App\Form\Ingredients;

use App\Entity\Ingredients\Cereal;
use App\Form\HelperIngredientType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class CerealType extends AbstractType
{
    use HelperIngredientType;
    public function buildForm(
        FormBuilderInterface $builder,
        array $options
    ) {
        $this->buildFormIngredient($builder, $options);
        $builder
            ->add("category")
            ->add("plant")
            ->add("type")
            ->add("format")
            ->add("ebc");
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(
            [
                'data_class'         => Cereal::class,
                'allow_extra_fields' => false,
                'csrf_protection'    => false,
            ]
        );
    }
}
