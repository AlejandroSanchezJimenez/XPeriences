<?php

namespace App\Repository;

use App\Entity\Tour;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Tour>
 *
 * @method Tour|null find($id, $lockMode = null, $lockVersion = null)
 * @method Tour|null findOneBy(array $criteria, array $orderBy = null)
 * @method Tour[]    findAll()
 * @method Tour[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TourRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Tour::class);
    }

    /**
     * @return Tour[] Returns an array of Tour objects
     */
    public function findOrderByFecha(): array
    {
        return $this->createQueryBuilder('t')
            ->where('t.Fecha > :currentDate')
            ->setParameter('currentDate', new \DateTime())
            ->orderBy('t.Fecha', 'ASC') // Puedes cambiar 'ASC' a 'DESC' según tus necesidades
            ->getQuery()
            ->getResult();
    }

    public function findHorasByGuia($id)
    {
        $entityManager = $this->registry->getManager();

        $queryBuilder = $entityManager->createQueryBuilder();
        $queryBuilder->select('DISTINCT(t.hora)')
                     ->from(Tour::class, 't')
                     ->where('t.guia_id = :guiaId')
                     ->setParameter('guiaId', $id);

        $query = $queryBuilder->getQuery();
        $result = $query->getResult();

        return $result;
    }

    public function remove(Tour $res)
    {
        return $this->createQueryBuilder('u')
            ->delete(Tour::class, 'u')
            ->andWhere('u.id = :id')
            ->setParameter('id', $res->getId())
            ->getQuery()
            ->execute();
    }
}
