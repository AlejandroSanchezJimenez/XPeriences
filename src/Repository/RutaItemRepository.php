<?php

namespace App\Repository;

use App\Entity\RutaItem;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<RutaItem>
 *
 * @method RutaItem|null find($id, $lockMode = null, $lockVersion = null)
 * @method RutaItem|null findOneBy(array $criteria, array $orderBy = null)
 * @method RutaItem[]    findAll()
 * @method RutaItem[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class RutaItemRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, RutaItem::class);
    }

//    /**
//     * @return RutaItem[] Returns an array of RutaItem objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('r')
//            ->andWhere('r.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('r.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?RutaItem
//    {
//        return $this->createQueryBuilder('r')
//            ->andWhere('r.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
