<?php

namespace App\Form;

use App\Entity\OrderQuantity;
use App\Entity\Customer;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;

class OrderQuantityType extends AbstractType
{

    public function buildForm(
        FormBuilderInterface $builder,
        array $options
    ) {
        $builder
            ->add("id")
            ->add("quantity")
            ->add("orderDate")
            ->add("giftBottleQuantity")
            ->add("sellBottleQuantity")
            ->add("giftKegQuantity")
            ->add("sellKegQuantity")
            ->add(
                'customer',
                EntityType::class,
                ['class' => Customer::class, 'required' => true]
            );
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(
            [
                'data_class'         => OrderQuantity::class,
                'allow_extra_fields' => false,
                'csrf_protection'    => false,
            ]
        );
    }
}