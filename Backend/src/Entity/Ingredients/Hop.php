<?php

namespace App\Entity\Ingredients;

use App\Entity\EnumHelper;
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
    const TYPES = [
        ['value' => 'pellets_t90', 'viewValue' => 'Pellets T90'],
        ['value' => 'pellets_t45', 'viewValue' => 'Pellets T45'],
        ['value' => 'cones', 'viewValue' => 'Cônes']
    ];

    public static function getTypes()
    {
        return EnumHelper::getEnum(Hop::TYPES);
    }
    /**
     * @ORM\Column(type="string", length=25)
     * @Assert\Choice(callback="getTypes", message="Sélectionne un type correct.")
     */
    private $type;

    /**
     * @ORM\Column(type="integer")
     * @SerializedName("acidAlpha")
     */
    private $acid_alpha;

    /**
     * @ORM\Column(type="integer")
     * @SerializedName("harvestYear")
     */
    private $harvest_year;

    public function __construct()
    {
        parent::__construct();
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

    public function getHarvestYear(): ?int
    {
        return $this->harvest_year;
    }

    public function setHarvestYear(int $harvest_year): self
    {
        $this->harvest_year = $harvest_year;

        return $this;
    }
}
