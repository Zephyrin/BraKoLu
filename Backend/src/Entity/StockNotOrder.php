<?php

namespace App\Entity;

use App\Repository\StockNotOrderRepository;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation\SerializedName;

/**
 * @ORM\Entity(repositoryClass=StockNotOrderRepository::class)
 */
class StockNotOrder
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=Order::class, inversedBy="stockNotOrders")
     * @ORM\JoinColumn(nullable=false)
     */
    private $ordered;

    /**
     * @ORM\OneToOne(targetEntity=BrewStock::class, inversedBy="stockNotOrder", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     * @SerializedName("brewStock")
     */
    private $brewStock;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getOrdered(): ?Order
    {
        return $this->ordered;
    }

    public function setOrdered(?Order $ordered): self
    {
        $this->ordered = $ordered;

        return $this;
    }

    public function getBrewStock(): ?BrewStock
    {
        return $this->brewStock;
    }

    public function setBrewStock(BrewStock $brewStock): self
    {
        $this->brewStock = $brewStock;

        return $this;
    }
}
