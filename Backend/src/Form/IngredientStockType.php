<?php

namespace App\Form;

use App\Entity\IngredientStock;
use App\Entity\Ingredient;
use App\Entity\Supplier;
use App\Entity\Order;
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
            ->add("id")
            ->add("quantity")
            ->add("price")
            ->add("state")
            ->add("deliveryScheduledFor")
            ->add(
                'ingredient',
                EntityType::class,
                ['class' => Ingredient::class, 'required' => true]
            )
            ->add(
                'supplier',
                EntityType::class,
                ['class' => Supplier::class, 'required' => false]
            )
            ->add(
                'order',
                EntityType::class,
                ['class' => Order::class]
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
