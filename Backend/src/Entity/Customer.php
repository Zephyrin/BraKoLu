<?php

namespace App\Entity;

use App\Repository\CustomerRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\Collection;

/**
 * @ORM\Entity(repositoryClass=CustomerRepository::class)
 */
class Customer
{

    const HEADERS = [
        ['value' => 'name', 'viewValue' => 'Nom'],
        ['value' => 'deposit', 'viewValue' => 'Consigne'],
        ['value' => 'kegDeposit', 'viewValue' => 'Consigne de Fût'],
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
     * @ORM\Column(type="integer", nullable=true)
     */
    private $deposit;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $kegDeposit;

    /**
     * @ORM\OneToMany(targetEntity=OrderQuantity::class, mappedBy="customer")
     */
    private $orderQuantities;

    public function __construct()
    {
        $this->orderQuantities = new ArrayCollection();
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

    public function getDeposit(): ?int
    {
        return $this->deposit;
    }

    public function setDeposit(int $deposit): self
    {
        $this->deposit = $deposit;

        return $this;
    }

    public function getKegDeposit(): ?int
    {
        return $this->kegDeposit;
    }

    public function setKegDeposit(?int $kegDeposit): self
    {
        $this->kegDeposit = $kegDeposit;

        return $this;
    }

    /**
     * @return Collection|Customer[]
     */
    public function getCustomers(): Collection
    {
        return $this->Customers;
    }

    public function addCustomer(Customer $customer): self
    {
        if (!$this->Customers->contains($customer)) {
            $this->Customers[] = $customer;
        }

        return $this;
    }

    public function removeCustomer(Customer $customer): self
    {
        if ($this->Customers->contains($customer)) {
            $this->Customers->removeElement($customer);
        }

        return $this;
    }

    /**
     * @return Collection|OrderQuantity[]
     */
    public function getOrderQuantities(): Collection
    {
        return $this->orderQuantities;
    }

    public function addOrderQuantity(OrderQuantity $orderQuantity): self
    {
        if (!$this->orderQuantities->contains($orderQuantity)) {
            $this->orderQuantities[] = $orderQuantity;
            $orderQuantity->setCustomer($this);
        }

        return $this;
    }

    public function removeOrderQuantity(OrderQuantity $orderQuantity): self
    {
        if ($this->orderQuantities->contains($orderQuantity)) {
            $this->orderQuantities->removeElement($orderQuantity);
            // set the owning side to null (unless already changed)
            if ($orderQuantity->getCustomer() === $this) {
                $orderQuantity->setCustomer(null);
            }
        }

        return $this;
    }
}