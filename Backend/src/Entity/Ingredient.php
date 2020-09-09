<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation\Exclude;
use Swagger\Annotations as SWG;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Gedmo\Mapping\Annotation as Gedmo;
use JMS\Serializer\Annotation\SerializedName;


/**
 * @SWG\Definition(
 *     description="Un ingredient est une classe abstraite de base qui est instanciée par un enfant de type Houblon,
 *  Levure, Bouteille..."
 * )
 *
 * @ORM\Entity(repositoryClass="App\Repository\IngredientRepository")
 */
class Ingredient
{
    /**
     * @var int|null
     *
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue
     * @ORM\Id
     */
    private $id;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=1024, nullable=false, unique=true)
     * @SWG\Property(description="Le nom de l'ingredient.")
     */
    private $name;

    /**
     * @var string|null
     * @ORM\Column(type="string", nullable=true)
     * @SWG\Property(description="Une ou plusieurs remarques/commentaires sur l'ingrédient.")
     */
    private $comment;

    /**
     * @ORM\Column(type="string", length=25, nullable=true)
     * @SWG\Property(description="Unité de l'ingrédient pour les quantités achetées.")
     */
    private $unit;

    /**
     * @SerializedName("unitFactor")
     * @ORM\Column(type="integer")
     * @SWG\Property(description="Le facteur de multiplication de l'unité pour faciliter les calculs, les quantités ne peuvent pas avoir de virgule.")
     */
    private $unitFactor;

    public function __construct()
    {
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): self
    {
        $this->name = $name;
        return $this;
    }

    public function getComment(): ?string
    {
        return $this->comment;
    }

    public function setComment(?string $comment): self
    {
        $this->comment = $comment;
        return $this;
    }

    public function getUnit(): ?string
    {
        return $this->unit;
    }

    public function setUnit(?string $unit): self
    {
        $this->unit = $unit;

        return $this;
    }

    public function getUnitFactor(): ?int
    {
        return $this->unitFactor;
    }

    public function setUnitFactor(int $unitFactor): self
    {
        $this->unitFactor = $unitFactor;

        return $this;
    }
}
