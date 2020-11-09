<?php

namespace App\Entity;

use App\Repository\BrewIngredientRepository;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation\Exclude;

/**
 * @ORM\Entity(repositoryClass=BrewIngredientRepository::class)
 */
class BrewIngredient
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     */
    private $quantity;

    /**
     * @ORM\ManyToOne(targetEntity=Brew::class, inversedBy="brewIngredients")
     * @ORM\JoinColumn(nullable=false)
     * @Exclude()
     */
    private $brew;

    /**
     * @ORM\ManyToOne(targetEntity=IngredientStock::class, inversedBy="brewIngredients")
     * @ORM\JoinColumn(nullable=false)
     */
    private $stock;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getQuantity(): ?int
    {
        return $this->quantity;
    }

    public function setQuantity(int $quantity): self
    {
        $this->quantity = $quantity;

        return $this;
    }

    public function getBrew(): ?Brew
    {
        return $this->brew;
    }

    public function setBrew(?Brew $brew): self
    {
        $this->brew = $brew;

        return $this;
    }

    public function getStock(): ?IngredientStock
    {
        return $this->stock;
    }

    public function setStock(?IngredientStock $stock): self
    {
        $this->stock = $stock;

        return $this;
    }
}
