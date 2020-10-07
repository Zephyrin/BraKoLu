<?php

namespace App\Entity\Ingredients;

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
    const TYPES = ['long_neck', 'champenoise'];
    const VOLUME = ['75', '33'];

    /**
     * @ORM\Column(type="integer")
     */
    private $volume;

    /**
     * @ORM\Column(type="string", length=30)
     */
    private $type;

    /**
     * @ORM\Column(type="string", length=30)
     */
    private $color;

    public function __construct()
    {
        parent::__construct();
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
}
