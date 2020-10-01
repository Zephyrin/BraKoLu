<?php

namespace App\Entity\Ingredients;

use App\Entity\Ingredient;
use App\Repository\Ingredients\BoxRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=BoxRepository::class)
 */
class Box extends Ingredient
{
    /**
     * @ORM\Column(type="integer")
     */
    private $capacity;

    public function getCapacity(): ?int
    {
        return $this->capacity;
    }

    public function setCapacity(int $capacity): self
    {
        $this->capacity = $capacity;

        return $this;
    }
}
