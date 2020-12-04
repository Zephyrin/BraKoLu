<?php

namespace App\Entity;

use App\Repository\IngredientStockRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use JMS\Serializer\Annotation\SerializedName;
use JMS\Serializer\Annotation\Type;
use JMS\Serializer\Annotation\Exclude;

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
     * @ORM\Column(type="integer", nullable=true)
     */
    private $quantity;

    /**
     * @ORM\Column(type="integer", nullable=true)
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
     * @ORM\ManyToOne(targetEntity=Order::class, inversedBy="stocks")
     */
    private $order;

    /**
     * @ORM\OneToMany(targetEntity=BrewStock::class, mappedBy="stock", orphanRemoval=true)
     * @SerializedName("brewStocks")
     */
    private $brewStocks;

    /**
     * @ORM\ManyToOne(targetEntity=Supplier::class, inversedBy="ingredientStocks")
     */
    private $supplier;

    /**
     * @ORM\Column(type="date", nullable=true)
     * @SerializedName("deliveryScheduledFor")
     */
    private $deliveryScheduledFor;

    public function __construct()
    {
        $this->brewStocks = new ArrayCollection();
    }

    public function calcFreeQuantity(): int
    {
        $quantity = $this->quantity;
        if ($quantity == null)
            $quantity = 0;
        foreach ($this->brewStocks as $brew) {
            if (!$brew->getApply())
                $quantity = $quantity - $brew->getQuantity();
        }
        return $quantity;
    }

    public function calcFreeQuantityWithoutCreatedBrew()
    {
        $quantity = $this->quantity;
        if ($quantity == null)
            $quantity = 0;
        foreach ($this->brewStocks as $brew) {
            if (
                !$brew->getApply()
                && $brew->getBrew()->getState() != 'created'
                && $brew->getBrew()->getState() != 'validate'
            )
                $quantity = $quantity - $brew->getQuantity();
        }
        return $quantity;
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

    public function setQuantity(?int $quantity): self
    {
        $this->quantity = $quantity;

        return $this;
    }

    public function getPrice(): ?int
    {
        return $this->price;
    }

    public function setPrice(?int $price): self
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

    public function getOrder(): ?Order
    {
        return $this->order;
    }

    public function setOrder(?Order $order): self
    {
        $this->order = $order;

        return $this;
    }

    /**
     * @return Collection|BrewStock[]
     */
    public function getBrewStocks(): Collection
    {
        return $this->brewStocks;
    }

    public function addBrewStock(BrewStock $brewStock): self
    {
        if (!$this->brewStocks->contains($brewStock)) {
            $this->brewStocks[] = $brewStock;
            $brewStock->setStock($this);
        }

        return $this;
    }

    public function removeBrewStock(BrewStock $brewStock): self
    {
        if ($this->brewStocks->contains($brewStock)) {
            $this->brewStocks->removeElement($brewStock);
            // set the owning side to null (unless already changed)
            if ($brewStock->getStock() === $this) {
                $brewStock->setStock(null);
            }
        }

        return $this;
    }

    public function getSupplier(): ?Supplier
    {
        return $this->supplier;
    }

    public function setSupplier(?Supplier $supplier): self
    {
        $this->supplier = $supplier;

        return $this;
    }

    public function getDeliveryScheduledFor(): ?\DateTimeInterface
    {
        return $this->deliveryScheduledFor;
    }

    public function setDeliveryScheduledFor(?\DateTimeInterface $deliveryScheduledFor): self
    {
        $this->deliveryScheduledFor = $deliveryScheduledFor;

        return $this;
    }
}
