<?php

namespace App\Entity;

use App\Repository\OrderQuantityRepository;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Validator\Constraints as Assert;
use JMS\Serializer\Annotation\SerializedName;
use JMS\Serializer\Annotation\Type;

/**
 * @ORM\Entity(repositoryClass=OrderQuantityRepository::class)
 */
class OrderQuantity
{
    const HEADERS = [
        ['value' => 'quantity', 'viewValue' => 'Quantité'],
        ['value' => 'orderDate', 'viewValue' => 'Date d\'achat'],
        ['value' => 'giftBottleQuantity', 'viewValue' => 'Nb. bouteille(s) offerte(s)'],
        ['value' => 'sellBottleQuantity', 'viewValue' => 'Nb. bouteille(s) achetée(s)'],
        ['value' => 'giftKegQuantity', 'viewValue' => 'Nb. fût(s) offert(s)'],
        ['value' => 'sellKegQuantity', 'viewValue' => 'Nb. fût(s) acheté(s)']
    ];

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @Assert\NotBlank(message="The quantity should not be null")
     * @ORM\Column(type="integer")
     */
    private $Quantity;

    /**
     * @Assert\NotBlank(message="The order date should not be null")
     * @ORM\Column(type="datetime")
     * @SerializedName("orderDate")
     * @Type("DateTime<'Y-m-d'>")
     */
    private $orderDate;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $giftBottleQuantity;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $sellBottleQuantity;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $giftKegQuantity;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $sellKegQuantity;

    /**
     * @ORM\ManyToOne(targetEntity=customer::class, inversedBy="orderQuantities")
     */
    private $customer;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getQuantity(): ?int
    {
        return $this->Quantity;
    }

    public function setQuantity(int $Quantity): self
    {
        $this->Quantity = $Quantity;

        return $this;
    }

    public function getOrderDate(): ?\DateTimeInterface
    {
        return $this->orderDate;
    }

    public function setOrderDate(\DateTimeInterface $orderDate): self
    {
        $this->orderDate = $orderDate;

        return $this;
    }

    public function getGiftBottleQuantity(): ?int
    {
        return $this->giftBottleQuantity;
    }

    public function setGiftBottleQuantity(?int $giftBottleQuantity): self
    {
        $this->giftBottleQuantity = $giftBottleQuantity;

        return $this;
    }

    public function getSellBottleQuantity(): ?int
    {
        return $this->sellBottleQuantity;
    }

    public function setSellBottleQuantity(?int $sellBottleQuantity): self
    {
        $this->sellBottleQuantity = $sellBottleQuantity;

        return $this;
    }

    public function getGiftKegQuantity(): ?int
    {
        return $this->giftKegQuantity;
    }

    public function setGiftKegQuantity(?int $giftKegQuantity): self
    {
        $this->giftKegQuantity = $giftKegQuantity;

        return $this;
    }

    public function getSellKegQuantity(): ?int
    {
        return $this->sellKegQuantity;
    }

    public function setSellKegQuantity(?int $sellKegQuantity): self
    {
        $this->sellKegQuantity = $sellKegQuantity;

        return $this;
    }

    public function getCustomer(): ?customer
    {
        return $this->customer;
    }

    public function setCustomer(?customer $customer): self
    {
        $this->customer = $customer;

        return $this;
    }

        /**
     * @return Collection|OrderQuantity[]
     */

    public function addOrderQuantity(OrderQuantity $orderQuantity): self
    {
        if (!$this->OrderQuantitys->contains($orderQuantity)) {
            $this->OrderQuantitys[] = $orderQuantity;
        }

        return $this;
    }

    public function removeOrderQuantity(OrderQuantity $orderQuantity): self
    {
        if ($this->OrderQuantitys->contains($orderQuantity)) {
            $this->OrderQuantitys->removeElement($orderQuantity);
        }

        return $this;
    }
}