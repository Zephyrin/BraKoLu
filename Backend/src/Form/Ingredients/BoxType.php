<?php

namespace App\Form\Ingredients;

use App\Entity\Ingredients\Bottle;
use App\Entity\Ingredients\Box;
use App\Form\HelperIngredientType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class BoxType extends AbstractType
{
    use HelperIngredientType;
    public function buildForm(
        FormBuilderInterface $builder,
        array $options
    ) {
        $this->buildFormIngredient($builder, $options);
        $builder
            ->add("capacity")
            ->add(
                "bottle",
                EntityType::class,
                ['class' => Bottle::class]
            );
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(
            [
                'data_class'         => Box::class,
                'allow_extra_fields' => false,
                'csrf_protection'    => false,
            ]
        );
    }
}
