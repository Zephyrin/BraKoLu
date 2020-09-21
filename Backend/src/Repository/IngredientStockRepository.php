<?php

namespace App\Repository;

use App\Entity\IngredientStock;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use FOS\RestBundle\Request\ParamFetcher;

/**
 * @method IngredientStock|null find($id, $lockMode = null, $lockVersion = null)
 * @method IngredientStock|null findOneBy(array $criteria, array $orderBy = null)
 * @method IngredientStock[]    findAll()
 * @method IngredientStock[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class IngredientStockRepository extends ServiceEntityRepository
{
    use AbstractRepository;

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, IngredientStock::class);
    }

    public function findAllPagination(ParamFetcher $paramFetcher)
    {
        $page = $paramFetcher->get('page');
        $limit = $paramFetcher->get('limit');
        $sort = $paramFetcher->get('sort');
        $sortBy = $paramFetcher->get('sortBy');
        $search = $paramFetcher->get('search');
        $query = $this->createQueryBuilder('e');
        if ($search != null) {
            // TODO: Mettre à jour la recherche des ingrédients. 
            $query = $query->andWhere(
                '(LOWER(e.comment) LIKE :search OR LOWER(e.name) LIKE :search)'
            )
                ->setParameter('search', "%" . addcslashes(strtolower($search), '%_') . '%');
        }
        return $this->resultCount($query, $page, $limit, $sort, $sortBy);
    }

    // /**
    //  * @return IngredientStock[] Returns an array of IngredientStock objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('i.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?IngredientStock
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
