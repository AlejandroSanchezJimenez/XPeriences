<?php

namespace App\Controller;

use App\Entity\Reserva;
use App\Entity\Ruta;
use App\Entity\User;
use App\Repository\RutaRepository;
use App\Repository\TourRepository;
use App\Repository\UserRepository;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ReservaController extends AbstractController
{
    #[Route('/reserva/api/crear', name: 'app_reserva_api_add', methods: ['POST'])]
    public function addReserva(Request $request, EntityManagerInterface $entityManager, UserRepository $userRep, TourRepository $tourRep): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Obtener los datos del item desde $data
        $tourid = $data['tour'];
        $userid = $data['user'];
        $apuntados = $data['apuntados'];

        // Crear una nueva entidad de Usuario
        $res = new Reserva();
        $user = new User();
        $tour = new Ruta();

        $user= $userRep->find($userid);
        $tour= $tourRep->find($tourid);

        $res->setTour($tour);
        $res->setUser($user);
        $res->setFecha(new DateTime());
        $res->setApuntados($apuntados);

        $entityManager->persist($res);
        $entityManager->flush();

        return $this->json(['message' => 'Reserva creada'], 201);
    }
}
