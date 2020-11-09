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
use Symfony\Component\Serializer\Annotation\DiscriminatorMap;

/**
 * @SWG\Definition(
 *     description="Un ingredient est une classe abstraite de base qui est instanciée par un enfant de type Houblon,
 *  Levure, Bouteille..."
 * )
 * @ORM\InheritanceType("SINGLE_TABLE")
 * @ORM\DiscriminatorColumn(name="childName", type="string")
 * @ORM\DiscriminatorMap({
 *      "bottle" = "App\Entity\Ingredients\Bottle"
 *      , "bottleTop" = "App\Entity\Ingredients\BottleTop"
 *      , "box" = "App\Entity\Ingredients\Box"
 *      , "cereal" = "App\Entity\Ingredients\Cereal"
 *      , "hop" = "App\Entity\Ingredients\Hop"
 *      , "keg" = "App\Entity\Ingredients\Keg"
 *      , "other" = "App\Entity\Ingredients\Other"
 *      , "yeast" = "App\Entity\Ingredients\Yeast"
 * })
 * @ORM\Entity(repositoryClass="App\Repository\IngredientRepository")
 * @DiscriminatorMap(
 *  typeProperty="childName"
 *  , fieldName="childName"
 *  , mapping={
 *      "bottle" = "App\Entity\Ingredients\Bottle"
 *      , "bottleTop" = "App\Entity\Ingredients\BottleTop"
 *      , "box" = "App\Entity\Ingredients\Box"
 *      , "cereal" = "App\Entity\Ingredients\Cereal"
 *      , "hop" = "App\Entity\Ingredients\Hop"
 *      , "keg" = "App\Entity\Ingredients\Keg"
 *      , "other" = "App\Entity\Ingredients\Other"
 *      , "yeast" = "App\Entity\Ingredients\Yeast"
 * })
 */
abstract class Ingredient
{
    const CHILDREN_NAMES = [
        ['value' => 'bottle', 'viewValue' => 'Bouteille'],
        ['value' => 'bottleTop', 'viewValue' => 'Capsule'],
        ['value' => 'box', 'viewValue' => 'Carton'],
        ['value' => 'cereal', 'viewValue' => 'Céréale'],
        ['value' => 'hop', 'viewValue' => 'Houblon'],
        ['value' => 'keg', 'viewValue' => 'Fût'],
        ['value' => 'other', 'viewValue' => 'Autre'],
        ['value' => 'yeast', 'viewValue' => 'Levure']
    ];

    const HEADERS = [
        ['value' => 'name', 'viewValue' => 'Nom'],
        ['value' => 'unit', 'viewValue' => 'Unité'],
        ['value' => 'unitFactor', 'viewValue' => 'Facteur d\'unité'],
        ['value' => 'comment', 'viewValue' => 'Commentaire'],
        ['value' => 'type', 'viewValue' => 'Type'],
        ['value' => 'plant', 'viewValue' => 'Plante'],
        ['value' => 'format', 'viewValue' => 'Format'],
        ['value' => 'ebc', 'viewValue' => 'EBC'],
        ['value' => 'volume', 'viewValue' => 'Volume'],
        ['value' => 'color', 'viewValue' => 'Couleur'],
        ['value' => 'capacity', 'viewValue' => 'Capacité'],
        ['value' => 'acidAlpha', 'viewValue' => 'Acid Alpha'],
        ['value' => 'harvestYear', 'viewValue' => 'Année de la récolte'],
        ['value' => 'childName', 'viewValue' => 'Classe'],
        ['value' => 'size', 'viewValue' => 'Taille'],
        ['value' => 'productionYear', 'viewValue' => 'Année de production'],
        ['value' => 'head', 'viewValue' => 'Tête'],
        ['value' => 'category', 'viewValue' => 'Catégorie'],
        ['value' => 'bottle', 'viewValue' => 'Bouteille']
    ];
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

    /**
     * @SerializedName("ingredientStocks")
     * @ORM\OneToMany(targetEntity=IngredientStock::class, mappedBy="ingredient", orphanRemoval=true)
     */
    private $ingredientStocks;

    public function __construct()
    {
        $this->ingredientStocks = new ArrayCollection();
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

    /**
     * @return Collection|IngredientStock[]
     */
    public function getIngredientStocks(): Collection
    {
        return $this->ingredientStocks;
    }

    public function addIngredientStock(IngredientStock $ingredientStock): self
    {
        if (!$this->ingredientStocks->contains($ingredientStock)) {
            $this->ingredientStocks[] = $ingredientStock;
            $ingredientStock->setIngredient($this);
        }

        return $this;
    }

    public function removeIngredientStock(IngredientStock $ingredientStock): self
    {
        if ($this->ingredientStocks->contains($ingredientStock)) {
            $this->ingredientStocks->removeElement($ingredientStock);
            // set the owning side to null (unless already changed)
            if ($ingredientStock->getIngredient() === $this) {
                $ingredientStock->setIngredient(null);
            }
        }

        return $this;
    }
}