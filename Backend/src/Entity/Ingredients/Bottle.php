<?php

namespace App\Entity\Ingredients;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use App\Entity\EnumHelper;
use App\Repository\Ingredients\BottleRepository;
use Doctrine\ORM\Mapping as ORM;
use App\Entity\Ingredient;
use JMS\Serializer\Annotation\SerializedName;
use Symfony\Component\Validator\Constraints as Assert;


/**
 * @ORM\Entity(repositoryClass=BottleRepository::class)
 */
class Bottle extends Ingredient
{
    const TYPES = [
        ['value' => 'long_neck', 'viewValue' => 'Long Neck'],
        ['value' => 'champenoise', 'viewValue' => 'Champenoise']
    ];
    const VOLUME = [
        ['value' => 75, 'viewValue' => '75 cL'],
        ['value' => 33, 'viewValue' => '33 cL']
    ];

    public static function getTypes()
    {
        return EnumHelper::getEnum(Bottle::TYPES);
    }

    public static function getVolumes()
    {
        return EnumHelper::getEnum(Bottle::VOLUME);
    }
    /**
     * @ORM\Column(type="integer")
     * @Assert\Choice(callback="getVolumes", message="Sélectionne un volume correct.")
     */
    private $volume;

    /**
     * @ORM\Column(type="string", length=30)
     * @Assert\Choice(callback="getTypes", message="Sélectionne un type correct.")
     */
    private $type;

    /**
     * @ORM\Column(type="string", length=30)
     */
    private $color;

    /**
     * @SerializedName("boxes")
     * @ORM\OneToMany(targetEntity=Box::class, mappedBy="bottle", orphanRemoval=true)
     */
    private $boxes;

    public function __construct()
    {
        parent::__construct();
        $this->boxes = new ArrayCollection();
    }

    public function getVolume(): ?int
    {
        return $this->volume;
    }

    public function setVolume(int $volume): self
    {
        $this->volume = $volume;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;

        return $this;
    }

    public function getColor(): ?string
    {
        return $this->color;
    }

    public function setColor(string $color): self
    {
        $this->color = $color;

        return $this;
    }

    /**
     * @return Collection|Box[]
     */
    public function getBoxes(): Collection
    {
        return $this->boxes;
    }

    public function addBox(Box $box): self
    {
        if (!$this->boxes->contains($box)) {
            $this->boxes[] = $box;
            $box->setBottle($this);
        }

        return $this;
    }

    public function removeBox(Box $box): self
    {
        if ($this->boxes->contains($box)) {
            $this->boxes->removeElement($box);
            // set the owning side to null (unless already changed)
            if ($box->getBottle() === $this) {
                $box->setBottle(null);
            }
        }

        return $this;
    }
}
