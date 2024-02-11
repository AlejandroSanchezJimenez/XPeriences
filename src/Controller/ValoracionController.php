<?php

namespace App\Controller;

use App\Entity\Reserva;
use App\Entity\Ruta;
use App\Entity\Tour;
use App\Entity\Valoracion;
use App\Repository\ReservaRepository;
use App\Repository\RutaRepository;
use App\Repository\TourRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

class ValoracionController extends AbstractController
{
    #[Route('/valoracion/api/crear', name: 'app_valoracion_api_add', methods: ['POST'])]
    public function addValoracion(Request $request, EntityManagerInterface $entityManager, RutaRepository $rutaRep, ReservaRepository $resRep): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        // Obtener los datos del usuario (id, email, isVerified) desde $data
        $rutaid = $data['ruta'];
        $reservaid = $data['reserva'];
        $puntuacion = $data['puntuacion'];

        // Crear una nueva entidad de Usuario
        $val = new Valoracion();
        $ruta = new Ruta();
        $reserva = new Reserva();

        $ruta = $rutaRep->find($rutaid);
        $reserva = $resRep->find($reservaid);

        $val->setRuta($ruta);
        $val->setReserva($reserva);
        $val->setPuntuacion($puntuacion);

        $entityManager->persist($val);
        $entityManager->flush();

        return $this->json(['message' => 'Valoracion creada'], 201);
    }
}
