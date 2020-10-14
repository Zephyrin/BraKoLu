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

    /**
     * @ORM\ManyToOne(targetEntity=Bottle::class, inversedBy="boxes")
     * @ORM\JoinColumn(nullable=true)
     */
    private $bottle;

    public function __construct()
    {
        parent::__construct();
    }

    public function getCapacity(): ?int
    {
        return $this->capacity;
    }

    public function setCapacity(int $capacity): self
    {
        $this->capacity = $capacity;

        return $this;
    }

    public function getBottle(): ?Bottle
    {
        return $this->bottle;
    }

    public function setBottle(?Bottle $bottle): self
    {
        $this->bottle = $bottle;

        return $this;
    }
}
