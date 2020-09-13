<?php

namespace App\Form;

use App\Entity\IngredientStock;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;

class IngredientStockType extends AbstractType
{

    public function buildForm(
        FormBuilderInterface $builder,
        array $options
    ) {
        $builder
            ->add("quantity")
            ->add("price")
            ->add("state")
            ->add("orderedDate")
            ->add("receivedDate")
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
                'data_class'         => IngredientStock::class,
                'allow_extra_fields' => false,
                'csrf_protection'    => false,
            ]
        );
    }
}
