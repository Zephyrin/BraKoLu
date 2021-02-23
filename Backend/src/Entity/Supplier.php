<?php

namespace App\Entity;

use App\Repository\SupplierRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation\SerializedName;
use JMS\Serializer\Annotation\Exclude;

/**
 * @ORM\Entity(repositoryClass=SupplierRepository::class)
 */
class Supplier
{
    const HEADERS = [
        ['value' => 'name', 'viewValue' => 'Nom']
    ];
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $name;

    /**
     * @ORM\OneToMany(targetEntity=IngredientStock::class, mappedBy="supplier")
     * @Exclude()
     */
    private $ingredientStocks;

    public function __construct()
    {
        $this->ingredientStocks = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return Collection|IngredientStock[]
     */
    public function getIngredientStocks(): Collection
    {
        return $this->ingredientStocks;
    }

    public function addIngredientStock(IngredientStock $ingredientStock): self
    {
        if (!$this->ingredientStocks->contains($ingredientStock)) {
            $this->ingredientStocks[] = $ingredientStock;
            $ingredientStock->setSupplier($this);
        }

        return $this;
    }

    public function removeIngredientStock(IngredientStock $ingredientStock): self
    {
        if ($this->ingredientStocks->contains($ingredientStock)) {
            $this->ingredientStocks->removeElement($ingredientStock);
            // set the owning side to null (unless already changed)
            if ($ingredientStock->getSupplier() === $this) {
                $ingredientStock->setSupplier(null);
            }
        }

        return $this;
    }
}
