<?php

namespace App\Repository;

use App\Entity\Ingredient;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use FOS\RestBundle\Request\ParamFetcher;

/**
 * @method Ingredient|null find($id, $lockMode = null, $lockVersion = null)
 * @method Ingredient|null findOneBy(array $criteria, array $orderBy = null)
 * @method Ingredient[]    findAll()
 * @method Ingredient[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class IngredientRepository extends ServiceEntityRepository
{
    use AbstractRepository;

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Ingredient::class);
    }

    public function findAllPagination(ParamFetcher $paramFetcher)
    {
        $search = $paramFetcher->get('search');
        $select = $paramFetcher->get('selectChildren');

        $query = $this->createQueryBuilder('e');
        /* if ($select != null) {
            $split = explode(',', $select);
            $sql = 'SELECT e FROM (SELECT e, 
                        (case';
            foreach ($split as $child) {
                $sql = $sql . ' when e INSTANCE OF App\\Entity\\Ingredients\\' . $child . ' then \'' . $child . '\'';
            }
            $sql = $sql . ' else \'unknown\' end) as childName FROM App\\Entity\\Ingredient e where';
            $or = ' ';
            foreach ($split as $child) {
                $sql = $sql . $or . 'childName = :' . $child;
                $or = ' OR ';
            }
            $sql = $sql . ')';
            $query = $this->getEntityManager()->createQuery($sql);
            foreach ($split as $child) {
                $query->setParameter($child, $child);
            }
            return [$query->execute(), 20, 20, 1, 20];
        } */
        if ($search != null)
            $query = $query->andWhere(
                '(LOWER(e.comment) LIKE :search OR LOWER(e.name) LIKE :search)'
            )
                ->setParameter('search', "%" . addcslashes(strtolower($search), '%_') . '%');
        if ($select != null) {
            $split = explode(',', $select);
            $sql = '(';
            $or = '';
            foreach ($split as $child) {
                $sql = $sql . $or . 'e INSTANCE OF App\\Entity\\Ingredients\\' . $child;
                $or = ' OR ';
            }
            $sql = $sql . ')';
            $query = $query->andWhere($sql);
        }
        return $this->resultCount($query, $paramFetcher);
    }
}
