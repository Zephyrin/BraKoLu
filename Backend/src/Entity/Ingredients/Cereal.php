<?php

namespace App\Entity\Ingredients;

use App\Repository\Ingredients\CerealRepository;
use Doctrine\ORM\Mapping as ORM;
use App\Entity\Ingredient;
use App\Entity\EnumHelper;
use JMS\Serializer\Annotation\SerializedName;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass=CerealRepository::class)
 */
class Cereal extends Ingredient
{
    // TODO à traduire en anglais
    const TYPES = [
        ['value' => 'malt', 'viewValue' => 'Malté'],
        ['value' => 'cru', 'viewValue' => 'Cru']
    ];

    // TODO à traduire en anglais
    const FORMATS = [
        ['value' => 'seed', 'viewValue' => 'Grain'],
        ['value' => 'flake', 'viewValue' => 'Flocon'],
        ['value' => 'extract', 'viewValue' => 'Extrait']
    ];

    public static function getTypes()
    {
        return EnumHelper::getEnum(Cereal::TYPES);
    }

    public static function getFormats()
    {
        return EnumHelper::getEnum(Cereal::FORMATS);
    }

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $plant;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\Choice(callback="getTypes", message="Sélectionne un type correct.")
     */
    private $type;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\Choice(callback="getFormats", message="Sélectionne un type correct.")
     */
    private $format;

    /**
     * @ORM\Column(type="integer")
     * @SerializedName("ebc")
     */
    private $EBC;

    public function __construct()
    {
        parent::__construct();
    }

    public function getPlant(): ?string
    {
        return $this->plant;
    }

    public function setPlant(string $plant): self
    {
        $this->plant = $plant;

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

    public function getFormat(): ?string
    {
        return $this->format;
    }

    public function setFormat(string $format): self
    {
        $this->format = $format;

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
}
