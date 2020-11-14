<?php

namespace App\Form;

use App\Entity\Order;
use App\Entity\IngredientStock;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;

class OrderType extends AbstractType
{

    public function buildForm(
        FormBuilderInterface $builder,
        array $options
    ) {
        $builder
            ->add("id")
            ->add('state')
            ->add(
                'stocks',
                CollectionType::class,
                ['class' => IngredientStock::class]
            );
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(
            [
                'data_class'         => Order::class,
                'allow_extra_fields' => false,
                'csrf_protection'    => false,
            ]
        );
    }
}
