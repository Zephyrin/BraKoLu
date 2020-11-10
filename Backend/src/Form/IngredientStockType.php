<?php

namespace App\Form;

use App\Entity\BrewStock;
use App\Entity\IngredientStock;
use App\Entity\Ingredient;
use App\Entity\Supplier;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;

class IngredientStockType extends AbstractType
{

    public function buildForm(
        FormBuilderInterface $builder,
        array $options
    ) {
        $builder
            ->add("id")
            ->add("quantity")
            ->add("price")
            ->add("state")
            ->add(
                'ingredient',
                EntityType::class,
                ['class' => Ingredient::class, 'required' => true]
            )
            ->add(
                'suppliers',
                CollectionType::class,
                ['entry_type' => Supplier::class]
            )
            ->add(
                'brewStocks',
                CollectionType::class,
                ['entry_type' => BrewStock::class]
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
