<?php

namespace App\Controller;

use App\Entity\Reserva;
use App\Entity\Ruta;
use App\Entity\User;
use App\Repository\ReservaRepository;
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

        $user = $userRep->find($userid);
        $tour = $tourRep->find($tourid);

        $res->setTour($tour);
        $res->setUser($user);
        $res->setFecha(new DateTime());
        $res->setApuntados($apuntados);

        $entityManager->persist($res);
        $entityManager->flush();

        return $this->json(['message' => 'Reserva creada'], 201);
    }

    #[Route('/reservas/api/{id}', name: 'app_reservas_api_id')]
    public function getReservasByUserId(ReservaRepository $locRepository, $id): JsonResponse
    {
        $localidades = $locRepository->findBy(['User' => $id]);
        $data = [];

        foreach ($localidades as $localidad) {
            $fotoBlob = $localidad->getTour()->getRuta()->getFoto();
            rewind($fotoBlob);
            $foto = stream_get_contents($fotoBlob);
            $data[] = [
                'id' => $localidad->getId(),
                'fecha' => $localidad->getTour()->getFecha(),
                'hora' => $localidad->getTour()->getHora(),
                'titulo' => $localidad->getTour()->getRuta()->getTitulo(),
                'apuntados' => $localidad->getApuntados(),
                'foto' => $foto,
                'ruta' => $localidad->getTour()->getRuta()->getId()
            ];
        }

        return $this->json($data, 200);
    }

    #[Route('/plantillaReservas', name: 'app_plantilla_reservas')]
    public function getplantillaRes(): Response
    {
        return $this->render('reserva/tarjetareserva.html.twig');
    }

    #[Route('/reserva/api/eliminar/{id}', name: 'app_reserva_api_delete', methods: ['DELETE'])]
    public function removeReserva(ReservaRepository $resRep, $id): JsonResponse
    {
        $reserva = $resRep->find($id);

        if (!$reserva) {
            return $this->json(['message' => 'No existe una reserva con ese ID'], 404);
        }

        $resRep->remove($reserva, true);

        return $this->json(['message' => 'Reserva eliminada'], 204);
    }

    #[Route('/reserva/api/edit/{id}', name: 'app_update_reserva_api')]
    public function updateReserva(Request $request, $id, ReservaRepository $tourRepository, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Obtener el tour existente
        $tour = $tourRepository->find($id);

        // Verificar si el tour existe
        if (!$tour) {
            return $this->json(['message' => 'Reserva no encontrada'], Response::HTTP_NOT_FOUND);
        }

        $tour->setApuntados($data['apuntados']);

        // Puedes agregar más campos para actualizar según tus necesidades

        // Persistir los cambios en la base de datos
        $entityManager->persist($tour);
        $entityManager->flush();

        return $this->json(['message' => 'Reserva actualizada correctamente'], Response::HTTP_OK);
    }
}
