<?php

namespace App\Form;

use App\Entity\Supplier;
use App\Entity\IngredientStock;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;

class SupplierType extends AbstractType
{

    public function buildForm(
        FormBuilderInterface $builder,
        array $options
    ) {
        $builder
            ->add("id")
            ->add("name")
            ->add(
                'ingredientStocks',
                CollectionType::class,
                ['entry_type' => IngredientStock::class]
            );
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(
            [
                'data_class'         => Supplier::class,
                'allow_extra_fields' => false,
                'csrf_protection'    => false,
            ]
        );
    }
}
