<?php

namespace App\Entity\Ingredients;

use App\Entity\Ingredient;
use App\Repository\Ingredients\OtherRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=OtherRepository::class)
 */
class Other extends Ingredient
{
    /**
     * @ORM\Column(type="string", length=512)
     */
    private $type;

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
}
