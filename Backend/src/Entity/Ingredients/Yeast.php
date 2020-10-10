<?php

namespace App\Entity\Ingredients;

use App\Entity\EnumHelper;
use App\Repository\Ingredients\YeastRepository;
use Doctrine\ORM\Mapping as ORM;
use App\Entity\Ingredient;
use JMS\Serializer\Annotation\SerializedName;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass=YeastRepository::class)
 */
class Yeast extends Ingredient
{
    const TYPES = [
        ['value' => 'dry', 'viewValue' => 'Sèche'],
        ['value' => 'liquid', 'viewValue' => 'Liquide']
    ];

    public static function getTypes()
    {
        return EnumHelper::getEnum(Yeast::TYPES);
    }
    /**
     * @ORM\Column(type="string", length=30)
     * @Assert\Choice(callback="getTypes", message="Sélectionne un type correct.")
     */
    private $type;

    /**
     * @ORM\Column(type="date")
     * @SerializedName("productionYear")
     */
    private $production_year;

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

    public function getProductionYear(): ?\DateTimeInterface
    {
        return $this->production_year;
    }

    public function setProductionYear(\DateTimeInterface $production_year): self
    {
        $this->production_year = $production_year;

        return $this;
    }
}
