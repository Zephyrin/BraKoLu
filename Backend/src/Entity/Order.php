<?php

namespace App\Entity;

use App\Repository\OrderRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use JMS\Serializer\Annotation\SerializedName;

/**
 * @ORM\Entity(repositoryClass=OrderRepository::class)
 * @ORM\Table(name="`order`")
 */
class Order
{
    const HEADERS = [
        ['value' => 'id', 'viewValue' => 'ID'],
        ['value' => 'created', 'viewValue' => 'Créé']
    ];

    const STATES = [
        ['value' => 'created', 'viewValue' => 'Crée'],
        ['value' => 'ordered', 'viewValue' => 'Commandé'],
        ['value' => 'received', 'viewValue' => 'Reçu']
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
     * @ORM\Column(type="datetime")
     */
    private $created;

    /**
     * @ORM\OneToMany(targetEntity=IngredientStock::class, mappedBy="order")
     */
    private $stocks;

    /**
     * @ORM\Column(type="string", length=30)
     * @Assert\Choice(callback="getStates", message="Sélectionne un status correct.")
     * @Assert\NotBlank(message="The state should not be null")
     */
    private $state;

    public function __construct()
    {
        $this->stocks = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCreated(): ?\DateTimeInterface
    {
        return $this->created;
    }

    public function setCreated(\DateTimeInterface $created): self
    {
        $this->created = $created;

        return $this;
    }

    /**
     * @return Collection|IngredientStock[]
     */
    public function getStocks(): Collection
    {
        return $this->stocks;
    }

    public function addStock(IngredientStock $stock): self
    {
        if (!$this->stocks->contains($stock)) {
            $this->stocks[] = $stock;
            $stock->setOrder($this);
        }

        return $this;
    }

    public function removeStock(IngredientStock $stock): self
    {
        if ($this->stocks->contains($stock)) {
            $this->stocks->removeElement($stock);
            // set the owning side to null (unless already changed)
            if ($stock->getOrder() === $this) {
                $stock->setOrder(null);
            }
        }

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
}
