<?php

namespace App\Form\Ingredients;

use App\Entity\Ingredients\Yeast;
use App\Form\HelperIngredientType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class YeastType extends AbstractType
{
    use HelperIngredientType;
    public function buildForm(
        FormBuilderInterface $builder,
        array $options
    ) {
        $this->buildFormIngredient($builder, $options);
        $builder
            ->add("productionYear")
            ->add("type");
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(
            [
                'data_class'         => Yeast::class,
                'allow_extra_fields' => false,
                'csrf_protection'    => false,
            ]
        );
    }
}