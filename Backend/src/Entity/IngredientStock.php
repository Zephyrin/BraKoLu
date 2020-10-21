<?php

namespace App\Entity;

use App\Repository\IngredientStockRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use JMS\Serializer\Annotation\SerializedName;
use JMS\Serializer\Annotation\Type;

/**
 * @ORM\Entity(repositoryClass=IngredientStockRepository::class)
 */
class IngredientStock
{
    const STATES = [
        ['value' => 'created', 'viewValue' => 'Crée'],
        ['value' => 'ordered', 'viewValue' => 'Commandé'],
        ['value' => 'stocked', 'viewValue' => 'Reçu'],
        ['value' => 'sold_out', 'viewValue' => 'Épuisé']
    ];

    const HEADERS = [
        ['value' => 'name', 'viewValue' => 'Nom'],
        ['value' => 'quantity', 'viewValue' => 'Quantité'],
        ['value' => 'state', 'viewValue' => 'État'],
        ['value' => 'creationDate', 'viewValue' => 'Crée le'],
        ['value' => 'orderedDate', 'viewValue' => 'Commandé le'],
        ['value' => 'endedDate', 'viewValue' => 'Terminé le']
    ];

    public static function getStates()
    {
        return EnumHelper::getEnum(IngredientStock::STATES);
    }

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @Assert\NotBlank(message="The creation date should not be null")
     * @ORM\Column(type="date")
     * @SerializedName("creationDate")
     */
    private $creationDate;

    /**
     * @Assert\NotBlank(message="The quantity should not be null")
     * @ORM\Column(type="integer")
     */
    private $quantity;

    /**
     * @Assert\NotBlank(message="The price should not be null")
     * @ORM\Column(type="integer")
     */
    private $price;

    /**
     * @ORM\Column(type="string", length=10)
     * @Assert\Choice(callback="getStates", message="Sélectionne un status correct.")
     * @Assert\NotBlank(message="The state should not be null")
     */
    private $state;

    /**
     * @ORM\Column(type="date", nullable=true)
     * @SerializedName("orderedDate")
     * @Type("DateTime<'Y-m-d'>")
     */
    private $orderedDate;

    /**
     * @ORM\Column(type="date", nullable=true)
     * @SerializedName("receivedDate")
     * @Type("DateTime<'Y-m-d'>")
     */
    private $receivedDate;

    /**
     * @ORM\Column(type="date", nullable=true)
     * @SerializedName("endedDate")
     * @Type("DateTime<'Y-m-d'>")
     */
    private $endedDate;

    /**
     * @ORM\ManyToOne(targetEntity=Ingredient::class, inversedBy="ingredientStocks")
     * @ORM\JoinColumn(nullable=false)
     */
    private $ingredient;

    /**
     * @ORM\ManyToMany(targetEntity=Supplier::class, inversedBy="ingredientStocks")
     */
    private $Suppliers;

    public function __construct()
    {
        $this->Suppliers = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCreationDate(): ?\DateTimeInterface
    {
        return $this->creationDate;
    }

    public function setCreationDate(?\DateTimeInterface $creationDate): self
    {
        $this->creationDate = $creationDate;

        return $this;
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

    public function getPrice(): ?int
    {
        return $this->price;
    }

    public function setPrice(int $price): self
    {
        $this->price = $price;

        return $this;
    }

    public function getState(): ?string
    {
        return $this->state;
    }

    public function setState(string $state): self
    {
        $this->state = $state;

        return $this;
    }

    public function getOrderedDate(): ?\DateTimeInterface
    {
        return $this->orderedDate;
    }

    public function setOrderedDate(?\DateTimeInterface $orderedDate): self
    {
        $this->orderedDate = $orderedDate;

        return $this;
    }

    public function getReceivedDate(): ?\DateTimeInterface
    {
        return $this->receivedDate;
    }

    public function setReceivedDate(?\DateTimeInterface $receivedDate): self
    {
        $this->receivedDate = $receivedDate;

        return $this;
    }

    public function getEndedDate(): ?\DateTimeInterface
    {
        return $this->endedDate;
    }

    public function setEndedDate(?\DateTimeInterface $endedDate): self
    {
        $this->endedDate = $endedDate;

        return $this;
    }

    public function getIngredient(): ?Ingredient
    {
        return $this->ingredient;
    }

    public function setIngredient(?Ingredient $ingredient): self
    {
        $this->ingredient = $ingredient;

        return $this;
    }

    /**
     * @return Collection|Supplier[]
     */
    public function getSuppliers(): Collection
    {
        return $this->Suppliers;
    }

    public function addSupplier(Supplier $supplier): self
    {
        if (!$this->Suppliers->contains($supplier)) {
            $this->Suppliers[] = $supplier;
        }

        return $this;
    }

    public function removeSupplier(Supplier $supplier): self
    {
        if ($this->Suppliers->contains($supplier)) {
            $this->Suppliers->removeElement($supplier);
        }

        return $this;
    }
}
