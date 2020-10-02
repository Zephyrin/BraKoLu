<?php

namespace App\Repository\Ingredients;

use App\Entity\Ingredients\Hop;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use FOS\RestBundle\Request\ParamFetcher;

/**
 * @method Hop|null find($id, $lockMode = null, $lockVersion = null)
 * @method Hop|null findOneBy(array $criteria, array $orderBy = null)
 * @method Hop[]    findAll()
 * @method Hop[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class HopRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Hop::class);
    }

    public function findAllPagination(ParamFetcher $paramFetcher)
    {
        $search = $paramFetcher->get('search');
        $query = $this->createQueryBuilder('e');
        if ($search != null)
            $query = $query->andWhere(
                '(LOWER(e.comment) LIKE :search OR LOWER(e.name) LIKE :search OR LOWER(e.type) LIKE :search' +
                    ' OR LOWER(e.type) LIKE :search)'
            )
                ->setParameter('search', "%" . addcslashes(strtolower($search), '%_') . '%');
        return $this->resultCount($query, $paramFetcher);
    }

    // /**
    //  * @return Hop[] Returns an array of Hop objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('h')
            ->andWhere('h.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('h.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Hop
    {
        return $this->createQueryBuilder('h')
            ->andWhere('h.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
