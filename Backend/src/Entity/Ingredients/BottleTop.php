<?php

namespace App\Entity\Ingredients;

use App\Entity\EnumHelper;
use App\Repository\Ingredients\BottleTopRepository;
use Doctrine\ORM\Mapping as ORM;
use App\Entity\Ingredient;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass=BottleTopRepository::class)
 */
class BottleTop extends Ingredient
{
    const SIZES = [
        ['value' => 26, 'viewValue' => '26 mm'],
        ['value' => 29, 'viewValue' => '29 mm']
    ];

    public static function getSizes()
    {
        return EnumHelper::getEnum(BottleTop::SIZES);
    }
    /**
     * @ORM\Column(type="integer")
     * @Assert\Choice(callback="getSizes", message="Sélectionne une taille correct.")
     */
    private $size;

    /**
     * @ORM\Column(type="string", length=30)
     */
    private $color;

    public function __construct()
    {
        parent::__construct();
    }

    public function getSize(): ?int
    {
        return $this->size;
    }

    public function setSize(int $size): self
    {
        $this->size = $size;

        return $this;
    }

    public function getColor(): ?string
    {
        return $this->color;
    }

    public function setColor(string $color): self
    {
        $this->color = $color;

        return $this;
    }
}
