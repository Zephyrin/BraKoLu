<?php

namespace App\Entity;

use App\Repository\BrewStockRepository;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation\SerializedName;

/**
 * @ORM\Entity(repositoryClass=BrewStockRepository::class)
 */
class BrewStock
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
     * @ORM\ManyToOne(targetEntity=Brew::class, inversedBy="brewStocks")
     * @ORM\JoinColumn(nullable=false)
     */
    private $brew;

    /**
     * @ORM\ManyToOne(targetEntity=IngredientStock::class, inversedBy="brewStocks")
     * @ORM\JoinColumn(nullable=false)
     */
    private $stock;

    /**
     * @ORM\Column(type="boolean")
     */
    private $apply;


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

    public function getApply(): ?bool
    {
        return $this->apply;
    }

    public function setApply(bool $apply): self
    {
        $this->apply = $apply;

        return $this;
    }
}
