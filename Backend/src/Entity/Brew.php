<?php

namespace App\Entity;

use App\Repository\BrewRepository;
use Doctrine\ORM\Mapping as ORM;
use App\Entity\EnumHelper;
use JMS\Serializer\Annotation\SerializedName;
use ProxyManager\ProxyGenerator\ValueHolder\MethodGenerator\Constructor;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass=BrewRepository::class)
 */
class Brew
{
    const HEADERS = [
        ['value' => 'name', 'viewValue' => 'Nom'],
        ['value' => 'abv', 'viewValue' => 'ABV'],
        ['value' => 'ibu', 'viewValue' => 'IBU'],
        ['value' => 'ebc', 'viewValue' => 'EBC'],
        ['value' => 'state', 'viewValue' => 'État'],
        ['value' => 'producedQuantity', 'viewValue' => 'Quantité réalisée'],
        ['value' => 'start', 'viewValue' => 'Début'],
        ['value' => 'ended', 'viewValue' => 'Fin'],
        ['value' => 'created', 'viewValue' => 'Créé']
    ];

    const STATES = [
        ['value' => 'created', 'viewValue' => 'Créé'],
        ['value' => 'validate', 'viewValue' => 'Validé'],
        ['value' => 'ordered', 'viewValue' => 'Commandé'],
        ['value' => 'brewing', 'viewValue' => 'Brassage'],
        ['value' => 'packaging', 'viewValue' => 'Conditionnement'],
        ['value' => 'complete', 'viewValue' => 'Complété'],
        ['value' => 'archived', 'viewValue' => 'Archivé']
    ];

    public static function getStates()
    {
        return EnumHelper::getEnum(Brew::STATES);
    }
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
     * @ORM\Column(type="integer")
     * @SerializedName("abv")
     */
    private $ABV;

    /**
     * @ORM\Column(type="integer")
     * @SerializedName("ibu")
     */
    private $IBU;

    /**
     * @ORM\Column(type="integer")
     * @SerializedName("ebc")
     */
    private $EBC;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\Choice(callback="getStates", message="Sélectionne un état de brassage correct.")
     */
    private $state;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @SerializedName("producedQuantity")
     */
    private $producedQuantity;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $started;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $ended;

    /**
     * @ORM\Column(type="datetime")
     */
    private $created;

    public function __construct()
    {
        $this->created = new \DateTime();
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

    public function getABV(): ?int
    {
        return $this->ABV;
    }

    public function setABV(int $ABV): self
    {
        $this->ABV = $ABV;

        return $this;
    }

    public function getIBU(): ?int
    {
        return $this->IBU;
    }

    public function setIBU(int $IBU): self
    {
        $this->IBU = $IBU;

        return $this;
    }

    public function getEBC(): ?int
    {
        return $this->EBC;
    }

    public function setEBC(int $EBC): self
    {
        $this->EBC = $EBC;

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

    public function getProducedQuantity(): ?int
    {
        return $this->producedQuantity;
    }

    public function setProducedQuantity(int $producedQuantity): self
    {
        $this->producedQuantity = $producedQuantity;

        return $this;
    }

    public function getStarted(): ?\DateTimeInterface
    {
        return $this->started;
    }

    public function setStarted(?\DateTimeInterface $started): self
    {
        $this->started = $started;

        return $this;
    }

    public function getEnded(): ?\DateTimeInterface
    {
        return $this->ended;
    }

    public function setEnded(?\DateTimeInterface $ended): self
    {
        $this->ended = $ended;

        return $this;
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
}
