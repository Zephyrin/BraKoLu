<?php

namespace App\Repository;

use App\Entity\BrewIngredient;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method BrewIngredient|null find($id, $lockMode = null, $lockVersion = null)
 * @method BrewIngredient|null findOneBy(array $criteria, array $orderBy = null)
 * @method BrewIngredient[]    findAll()
 * @method BrewIngredient[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class BrewIngredientRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, BrewIngredient::class);
    }
}
