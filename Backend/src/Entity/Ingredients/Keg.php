<?php

namespace App\Entity\Ingredients;

use App\Entity\EnumHelper;
use App\Repository\Ingredients\KegRepository;
use App\Entity\Ingredient;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass=KegRepository::class)
 */
class Keg extends Ingredient
{
    const HEAD = [
        ['value' => 'A', 'viewValue' => 'A'],
        ['value' => 'S', 'viewValue' => 'S']
    ];
    const VOLUME = [
        ['value' => 20, 'viewValue' => '20'],
        ['value' => 30, 'viewValue' => '30']
    ];

    public static function getHeads()
    {
        return EnumHelper::getEnum(Keg::HEAD);
    }

    public static function getVolumes()
    {
        return EnumHelper::getEnum(Keg::VOLUME);
    }

    /**
     * @ORM\Column(type="integer")
     * @Assert\Choice(callback="getVolumes", message="Sélectionne un volume correct.")
     */
    private $volume;

    /**
     * @ORM\Column(type="string", length=30)
     * @Assert\Choice(callback="getHeads", message="Sélectionne une tête correct.")
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
