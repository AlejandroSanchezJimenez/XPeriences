<?php

namespace App\Controller;

use App\Entity\Informe;
use App\Entity\Tour;
use App\Repository\RutaRepository;
use App\Repository\TourRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class InformeController extends AbstractController
{
    #[Route('/informe/api/crear', name: 'app_informe_api_add', methods: ['POST'])]
    public function addValoracion(Request $request, EntityManagerInterface $entityManager, TourRepository $tourRep): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        // Obtener los datos del usuario (id, email, isVerified) desde $data
        $tourid = $data['tour'];
        $foto = $data['foto'];
        $ingresos = $data['ingresos'];

        // Crear una nueva entidad de Usuario
        $inf = new Informe();
        $tour = new Tour();

        $tour = $tourRep->find($tourid);;

        $inf->setTour($tour);
        $inf->setFotoGrupo($foto);
        $inf->setDineroRuta($ingresos);

        $entityManager->persist($inf);
        $entityManager->flush();

        return $this->json(['message' => 'Informe creado'], 201);
    }
}
