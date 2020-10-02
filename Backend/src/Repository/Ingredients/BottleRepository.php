<?php

namespace App\Repository\Ingredients;

use App\Entity\Ingredients\Bottle;
use App\Repository\AbstractRepository;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use FOS\RestBundle\Request\ParamFetcher;

/**
 * @method Bottle|null find($id, $lockMode = null, $lockVersion = null)
 * @method Bottle|null findOneBy(array $criteria, array $orderBy = null)
 * @method Bottle[]    findAll()
 * @method Bottle[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class BottleRepository extends ServiceEntityRepository
{
    use AbstractRepository;

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Bottle::class);
    }

    public function findAllPagination(ParamFetcher $paramFetcher)
    {
        $search = $paramFetcher->get('search');
        $query = $this->createQueryBuilder('e');
        if ($search != null)
            $query = $query->andWhere(
                '(LOWER(e.comment) LIKE :search OR LOWER(e.name) LIKE :search OR LOWER(e.type) LIKE :search OR' +
                    ' LOWER(e.color) LIKE :search)'
            )
                ->setParameter('search', "%" . addcslashes(strtolower($search), '%_') . '%');
        return $this->resultCount($query, $paramFetcher);
    }
    // /**
    //  * @return Bottle[] Returns an array of Bottle objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('b')
            ->andWhere('b.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('b.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Bottle
    {
        return $this->createQueryBuilder('b')
            ->andWhere('b.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
