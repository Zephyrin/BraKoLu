<?php

namespace App\Form;

use App\Entity\Brew;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;

class BrewType extends AbstractType
{

    public function buildForm(
        FormBuilderInterface $builder,
        array $options
    ) {
        $builder
            ->add("id")
            ->add("name")
            ->add("abv")
            ->add("ibu")
            ->add("ebc")
            ->add("state")
            ->add("producedQuantity")
            ->add("started")
            ->add("ended");
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(
            [
                'data_class'         => Brew::class,
                'allow_extra_fields' => false,
                'csrf_protection'    => false,
            ]
        );
    }
}