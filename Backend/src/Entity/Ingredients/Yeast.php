<?php

namespace App\Entity\Ingredients;

use App\Repository\Ingredients\YeastRepository;
use Doctrine\ORM\Mapping as ORM;
use App\Entity\Ingredient;

/**
 * @ORM\Entity(repositoryClass=YeastRepository::class)
 */
class Yeast extends Ingredient
{
    const TYPES = ['dry', 'liquid'];

    /**
     * @ORM\Column(type="string", length=30)
     */
    private $type;

    /**
     * @ORM\Column(type="date")
     */
    private $productionYear;

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
        return $this->productionYear;
    }

    public function setProductionYear(\DateTimeInterface $productionYear): self
    {
        $this->productionYear = $productionYear;

        return $this;
    }
}
