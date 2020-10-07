<?php

namespace App\Entity\Ingredients;

use App\Repository\Ingredients\BottleTopRepository;
use Doctrine\ORM\Mapping as ORM;
use App\Entity\Ingredient;

/**
 * @ORM\Entity(repositoryClass=BottleTopRepository::class)
 */
class BottleTop extends Ingredient
{
    const SIZES = ['26', '29'];

    /**
     * @ORM\Column(type="integer")
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
