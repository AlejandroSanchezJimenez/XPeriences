<?php

namespace App\Controller;

use App\Entity\Tour;
use App\Entity\User;
use App\Entity\Valoracion;
use App\Repository\ReservaRepository;
use App\Repository\TourRepository;
use App\Repository\UserRepository;
use App\Repository\ValoracionRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Constraints\Length;

class ToursController extends AbstractController
{
    #[Route('/tours/api', name: 'app_tours_api')]
    public function getAllTours(TourRepository $locRepository, ValoracionRepository $valRep): JsonResponse
    {
        $tours = $locRepository->findOrderByFecha();
        $data = [];

        foreach ($tours as $tour) {
            $fotoBlob = $tour->getRuta()->getFoto();
            rewind($fotoBlob);
            $foto = stream_get_contents($fotoBlob);

            $valoraciones = $valRep->findBy(['Ruta' => $tour->getRuta()->getId()]);

            $sumaPuntuaciones = 0;
            $numValoraciones = count($valoraciones);

            foreach ($valoraciones as $valoracion) {
                $sumaPuntuaciones += $valoracion->getPuntuacion();
            }

            if ($numValoraciones > 0) {
                $media = $sumaPuntuaciones / $numValoraciones;
            } else {
                $media = 0;
            }

            $data[] = [
                'id' => $tour->getId(),
                'fecha' => $tour->getFecha(),
                'hora' => $tour->getHora(),
                'guia' => $tour->getGuia()->getEmail(),
                'titulo' => $tour->getRuta()->getTitulo(),
                'loc' => $tour->getRuta()->getLocalidad()->getNombre(),
                'desc' => $tour->getRuta()->getDescripcion(),
                'foto' => $foto,
                'valoracion' => $media
            ];
        }

        return $this->json($data, 200);
    }

    #[Route('/tour/api/{id}', name: 'app_tour_api_id')]
    public function getTourByGuia(TourRepository $locRepository, ReservaRepository $resRep, $id): JsonResponse
    {
        $localidades = $locRepository->findBy(['Guia' => $id]);
        $data = [];

        foreach ($localidades as $localidad) {
            $tourConRes = $resRep->findBy(['Tour' => $localidad->getId()]);
            $totalApuntados = 0;
            $emApuntados = [];
            foreach ($tourConRes as $tour) {
                $totalApuntados += $tour->getApuntados();
                array_push($emApuntados, $tour->getUser()->getEmail());
            }
            $fotoBlob = $localidad->getRuta()->getFoto();
            rewind($fotoBlob);
            $foto = stream_get_contents($fotoBlob);
            $data[] = [
                'id' => $localidad->getId(),
                'fecha' => $localidad->getFecha(),
                'hora' => $localidad->getHora(),
                'titulo' => $localidad->getRuta()->getTitulo(),
                'foto' => $foto,
                'ruta' => $localidad->getRuta()->getId(),
                'apuntados' => $totalApuntados,
                'reservas' => $emApuntados
            ];
        }

        return $this->json($data, 200);
    }

    #[Route('/tours/api/edit/{id}', name: 'app_update_tour_api')]
    public function updateTour(Request $request, $id, UserRepository $usRep, TourRepository $tourRepository, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Obtener el tour existente
        $tour = $tourRepository->find($id);

        // Verificar si el tour existe
        if (!$tour) {
            return $this->json(['message' => 'Tour no encontrado'], Response::HTTP_NOT_FOUND);
        }

        // Actualizar los campos del tour si se proporcionan en los datos
        if (isset($data['guia'])) {
            $guia = new User();
            $guia= $usRep->find($data['guia']);
            $tour->setGuia($guia);
        }

        if (isset($data['hora'])) {
            $tour->setHora($data['hora']);
        }

        // Puedes agregar más campos para actualizar según tus necesidades

        // Persistir los cambios en la base de datos
        $entityManager->persist($tour);
        $entityManager->flush();

        return $this->json(['message' => 'Tour actualizado correctamente'], Response::HTTP_OK);
    }
    
    #[Route('/tour/api/eliminar/{id}', name: 'app_tours_api_delete', methods: ['DELETE'])]
    public function removeReserva(TourRepository $resRep, $id): JsonResponse
    {
        $reserva = $resRep->find($id);

        if (!$reserva) {
            return $this->json(['message' => 'No existe un toiur con ese ID'], 404);
        }

        $resRep->remove($reserva, true);

        return $this->json(['message' => 'Tour eliminado'], 204);
    }


    // #[Route('/tours/api/{id}', name: 'app_tours_api_id')]
    // public function getTourByUserId(TourRepository $locRepository, $id): JsonResponse
    // {
    //     $localidades = $locRepository->findBy($id);
    //     $data = [];

    //     foreach ($localidades as $localidad) {
    //         $data[] = [
    //             'id' => $localidad->getId(),
    //             'fecha' => $localidad->getFecha(),
    //             'hora' => $localidad->getHora(),
    //             'guia' => $localidad->getGuia()->getEmail(),
    //             'titulo' => $localidad->getRuta()->getTitulo(),
    //             'loc' => $localidad->getRuta()->getLocalidad()->getNombre()
    //         ];
    //     }

    //     return $this->json($data, 200);
    // }
}
