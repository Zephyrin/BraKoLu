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
    private $Capacity;

    public function getCapacity(): ?int
    {
        return $this->Capacity;
    }

    public function setCapacity(int $Capacity): self
    {
        $this->Capacity = $Capacity;

        return $this;
    }
}
