<?php

namespace App\Controller;

use App\Entity\Tour;
use App\Repository\TourRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ToursController extends AbstractController
{
    #[Route('/tours/api', name: 'app_tours_api')]
    public function getAllLocalidades(TourRepository $locRepository): JsonResponse
    {
        $localidades = $locRepository->findOrderByFecha();
        $data = [];

        foreach ($localidades as $localidad) {
            $data[] = [
                'id' => $localidad->getId(),
                'fecha' => $localidad->getFecha(),
                'hora' => $localidad->getHora(),
                'guia' => $localidad->getGuia()->getEmail(),
                'titulo' => $localidad->getRuta()->getTitulo(),
                'loc' => $localidad->getRuta()->getLocalidad()->getNombre(),
                'desc' => $localidad->getRuta()->getDescripcion()
            ];
        }

        return $this->json($data, 200);
    }

    // #[Route('/tours/api/{loc}/{fec}', name: 'app_tours_api')]
    // public function getTourBySearch(TourRepository $locRepository): JsonResponse
    // {
    //     $localidades = $locRepository->findBy();
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
