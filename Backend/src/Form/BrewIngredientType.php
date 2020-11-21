<?php

namespace App\Form;

use App\Entity\Brew;
use App\Entity\BrewIngredient;
use App\Entity\Ingredient;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;

class BrewIngredientType extends AbstractType
{

    public function buildForm(
        FormBuilderInterface $builder,
        array $options
    ) {
        $builder
            ->add("id")
            ->add("quantity")
            ->add(
                'brew',
                EntityType::class,
                ['class' => Brew::class, 'required' => true]
            )
            ->add(
                'ingredient',
                EntityType::class,
                ['class' => Ingredient::class, 'required' => true]
            );
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(
            [
                'data_class'         => BrewIngredient::class,
                'allow_extra_fields' => false,
                'csrf_protection'    => false,
            ]
        );
    }
}
