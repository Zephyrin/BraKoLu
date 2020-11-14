<?php

namespace App\Repository;

use App\Entity\StockNotOrder;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method StockNotOrder|null find($id, $lockMode = null, $lockVersion = null)
 * @method StockNotOrder|null findOneBy(array $criteria, array $orderBy = null)
 * @method StockNotOrder[]    findAll()
 * @method StockNotOrder[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class StockNotOrderRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, StockNotOrder::class);
    }

    // /**
    //  * @return StockNotOrder[] Returns an array of StockNotOrder objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('s.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?StockNotOrder
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
