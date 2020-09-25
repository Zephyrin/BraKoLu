<?php

namespace App\Entity;

use App\Repository\HopRepository;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation\SerializedName;

/**
 * @ORM\Entity(repositoryClass=HopRepository::class)
 */
class Hop extends Ingredient
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=25)
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
