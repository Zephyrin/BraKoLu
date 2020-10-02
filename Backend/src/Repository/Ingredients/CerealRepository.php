<?php

namespace App\Repository\Ingredients;

use App\Entity\Ingredients\Cereal;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use FOS\RestBundle\Request\ParamFetcher;

/**
 * @method Cereal|null find($id, $lockMode = null, $lockVersion = null)
 * @method Cereal|null findOneBy(array $criteria, array $orderBy = null)
 * @method Cereal[]    findAll()
 * @method Cereal[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CerealRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Cereal::class);
    }

    public function findAllPagination(ParamFetcher $paramFetcher)
    {
        $search = $paramFetcher->get('search');
        $query = $this->createQueryBuilder('e');
        if ($search != null)
            $query = $query->andWhere(
                '(LOWER(e.comment) LIKE :search OR LOWER(e.name) LIKE :search OR LOWER(e.plant) LIKE :search' +
                    ' OR LOWER(e.type) LIKE :search OR LOWER(e.format) LIKE :search)'
            )
                ->setParameter('search', "%" . addcslashes(strtolower($search), '%_') . '%');
        return $this->resultCount($query, $paramFetcher);
    }

    // /**
    //  * @return Cereal[] Returns an array of Cereal objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('c.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Cereal
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
