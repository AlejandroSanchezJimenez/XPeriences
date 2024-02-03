<?php

namespace App\Controller;

use App\Entity\Item;
use App\Repository\ItemRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ItemApiController extends AbstractController
{
    #[Route('/item/api/crear', name: 'app_item_api_add', methods: ['POST'])]
    public function addUsuario(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Obtener los datos del item desde $data
        $titulo = $data['titulo'];
        $desc = $data['descripcion'];
        $foto = $data['foto'];
        $latitud = $data['latitud'];
        $longitud = $data['longitud'];

        // Crear una nueva entidad de Usuario
        $item = new Item();
        $item->setTitulo($titulo);
        $item->setDescripcion($desc);
        $item->setFoto($foto);
        $item->setGeolocalizacion($latitud.', '.$longitud);

        $entityManager->persist($item);
        $entityManager->flush();

        return $this->json(['message' => 'Item creado'], 201);
    }

    #[Route('/item/api', name: 'app_item_api')]
    public function getAllItems(ItemRepository $itemRepository): JsonResponse
    {
        $items = $itemRepository->findAll();
        $data = [];

        foreach ($items as $item) {
            list($latitud, $longitud) = explode(', ', $item->getGeolocalizacion());
            $data[] = [
                'titulo' => $item->getTitulo(),
                'latitud' => $latitud,
                'longitud' => $longitud,
                'id' => $item->getId()
            ];
        }

        return $this->json($data, 200);
    }
}
