<?php

namespace App\Repository;

use App\Entity\Brew;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use FOS\RestBundle\Request\ParamFetcher;

/**
 * @method Brew|null find($id, $lockMode = null, $lockVersion = null)
 * @method Brew|null findOneBy(array $criteria, array $orderBy = null)
 * @method Brew[]    findAll()
 * @method Brew[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class BrewRepository extends ServiceEntityRepository
{
    use AbstractRepository;

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Brew::class);
    }

    public function findAllPagination(ParamFetcher $paramFetcher)
    {
        $search = $paramFetcher->get('search');
        $query = $this->createQueryBuilder('e');
        if ($search != null) {
            // TODO: Mettre à jour la recherche des ingrédients. 
            $query = $query->andWhere(
                '(LOWER(e.name) LIKE :search)'
            )
                ->setParameter('search', "%" . addcslashes(strtolower($search), '%_') . '%');
        }
        $query = $this->orList($query, $paramFetcher->get('states'), 'e.state = ');
        return $this->resultCount($query, $paramFetcher);
    }
    // /**
    //  * @return Brew[] Returns an array of Brew objects
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
    public function findOneBySomeField($value): ?Brew
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
