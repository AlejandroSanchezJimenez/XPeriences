<?php

namespace App\Controller;

use App\Entity\Tour;
use App\Entity\Valoracion;
use App\Repository\ReservaRepository;
use App\Repository\TourRepository;
use App\Repository\ValoracionRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
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
            $emApuntados=[];
            foreach ($tourConRes as $tour) {
                $totalApuntados += $tour->getApuntados();
                array_push($emApuntados,$tour->getUser()->getEmail());
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
