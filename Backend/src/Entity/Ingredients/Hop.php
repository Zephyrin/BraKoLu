<?php

namespace App\Entity\Ingredients;

use App\Repository\Ingredients\HopRepository;
use App\Entity\Ingredient;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation\SerializedName;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass=HopRepository::class)
 */
class Hop extends Ingredient
{
    const TYPES = ['pellets_t90', 'cônes'];
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=25)
     * @Assert\Choice(choices=Hop::TYPES, message="Sélectionne un type correct.")
     */
    private $type;

    /**
     * @ORM\Column(type="integer")
     * @SerializedName("acidAlpha")
     */
    private $acid_alpha;

    /**
     * @ORM\Column(type="date")
     * @SerializedName("harvestYear")
     */
    private $harvest_year;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getAcidAlpha(): ?int
    {
        return $this->acid_alpha;
    }

    public function setAcidAlpha(int $acid_alpha): self
    {
        $this->acid_alpha = $acid_alpha;

        return $this;
    }

    public function getHarvestYear(): ?\DateTimeInterface
    {
        return $this->harvest_year;
    }

    public function setHarvestYear(\DateTimeInterface $harvest_year): self
    {
        $this->harvest_year = $harvest_year;

        return $this;
    }
}
