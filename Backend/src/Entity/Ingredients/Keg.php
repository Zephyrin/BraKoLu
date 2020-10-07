<?php

namespace App\Entity\Ingredients;

use App\Repository\Ingredients\KegRepository;
use App\Entity\Ingredient;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation\SerializedName;
use Symfony\Component\Validator\Constraints as Assert;


/**
 * @ORM\Entity(repositoryClass=KegRepository::class)
 */
class Keg extends Ingredient
{
    const HEAD = ['A', 'S'];
    const VOLUME = ['20', '30'];

    /**
     * @ORM\Column(type="integer")
     */
    private $volume;

    /**
     * @ORM\Column(type="string", length=30)
     */
    private $head;

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

    public function getHead(): ?string
    {
        return $this->head;
    }

    public function setHead(string $head): self
    {
        $this->head = $head;

        return $this;
    }
}
