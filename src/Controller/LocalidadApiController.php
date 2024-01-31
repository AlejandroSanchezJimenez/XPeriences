<?php

namespace App\Controller;

use App\Entity\Codipostal;
use App\Entity\Localidad;
use App\Repository\CodipostalRepository;
use App\Repository\LocalidadRepository;
use App\Repository\ProvinciaRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class LocalidadApiController extends AbstractController
{
    #[Route('/localidad/api', name: 'app_localidad_api')]
    public function getAllLocalidades(ProvinciaRepository $locRepository): JsonResponse
    {
        $localidades = $locRepository->findAll();
        $data = [];

        foreach ($localidades as $localidad) {
            $data[] = [
                'nombre' => $localidad->getCodProv()
            ];
        }

        return $this->json($data, 200);
    }

    #[Route('/localidad/api/{id}', name: 'app_localidad_api_getOne', methods: ['GET'])]
    public function getLocalidad(LocalidadRepository $categoriaRepository, $id): JsonResponse
    {
        $categoria = $categoriaRepository->find($id);

        if (!$categoria) {
            return $this->json(['message' => 'No existe una localidad con ese ID'], 404);
        }

        $data = [
            'id' => $categoria->getId()
        ];

        return $this->json($data, 200);
    }
}
