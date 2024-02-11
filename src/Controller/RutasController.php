<?php

namespace App\Controller;

use App\Entity\Ruta;
use App\Entity\RutaItem;
use App\Entity\Tour;
use App\Repository\ItemRepository;
use App\Repository\LocalidadRepository;
use App\Repository\TourRepository;
use App\Repository\UserRepository;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Constraints\Date;

class RutasController extends AbstractController
{
    #[Route('/rutas', name: 'app_rutas')]
    public function index(TourRepository $tourRep): Response
    {
        $criteria = ['Fecha' => new \DateTime('2024-02-01')];

        // Ordenar por fecha de forma ascendente (puedes cambiar a 'DESC' para descendente)
        $orderBy = ['Fecha' => 'ASC'];

        // Obtén los tours por fecha y ordena utilizando findBy
        // $tours = $tourRep->findBy($criteria, $orderBy);
        $tours = $tourRep->findOrderByFecha();
        // $tours = $tourRep->findAll();

        $fotoB64 = [];
        foreach ($tours as $tour) {
            array_push($fotoB64, base64_encode(stream_get_contents($tour->getRuta()->getFoto())));
        }

        return $this->render('rutas/index.html.twig', [
            'tours' => $tours,
            'fotos' => $fotoB64
        ]);
    }

    #[Route('/plantillaTour', name: 'app_plantilla')]
    public function plantillaTour(): Response
    {
        return $this->render('rutas/tarjetaTour.html.twig');
    }

    #[Route('/ruta/api/crear', name: 'app_ruta_api_add', methods: ['POST'])]
    public function addRuta(Request $request, EntityManagerInterface $entityManager, LocalidadRepository $locrep, ItemRepository $itrep, UserRepository $userRep): JsonResponse
    {
        try {
            $entityManager->beginTransaction();

            $data = json_decode($request->getContent(), true);

            $titulo = $data['titulo'];
            $desc = $data['desc'];
            $aforo = $data['aforo'];
            $foto = $data['foto'];
            $fecIni = new DateTime($data['fec_ini']);
            $fecFin = new DateTime($data['fec_fin']);
            $latitud = $data['latitud'];
            $longitud = $data['longitud'];
            $items = $data['items'];
            $programacion = $data['programacion'];
            $localidad = $data['localidad'];

            // Crear una nueva entidad de Ruta utilizando un DTO (si es posible)
            $ruta = new Ruta();
            $ruta->setTitulo($titulo);
            $ruta->setDescripcion($desc);
            $ruta->setAforo($aforo);
            $ruta->setFoto($foto);
            $ruta->setFechaIni($fecIni);
            $ruta->setFechaFin($fecFin);
            $ruta->setPuntoInicio($latitud . ', ' . $longitud);
            $ruta->setLocalidad($locrep->find($localidad));

            $entityManager->persist($ruta);

            // Flush después de persistir la ruta principal
            $entityManager->flush();

            foreach ($items as $item) {
                $rutaItem = new RutaItem();
                $rutaItem->setItem($itrep->find($item));
                $rutaItem->setRuta($ruta);

                $entityManager->persist($rutaItem);
            }

            // Flush después de persistir todos los items
            $entityManager->flush();

            foreach ($programacion['fragmento'] as $data) {
                $fecIni = new DateTime($data['inicio']);
                $fecFin = new DateTime($data['fin']);
                $guia = $userRep->find($data['guia']);

                while ($fecIni <= $fecFin) {
                    foreach ($data['dia'] as $dia) {
                        if ($fecIni->format('N') == $dia) {
                            $tour = new Tour();
                            $tour->setRuta($ruta);
                            $tour->setGuia($guia);

                            // Clonar la fecha para evitar modificar la misma instancia
                            $fechaTour = clone $fecIni;

                            $tour->setFecha($fechaTour);
                            $tour->setHora($data['hora']);

                            $entityManager->persist($tour);
                        }
                    }
                    $fecIni = $fecIni->modify('+1 day'); // Modifica el objeto original $fecIni
                }
            }


            // Flush después de persistir todos los tours
            $entityManager->flush();

            // Confirmar la transacción
            $entityManager->commit();

            return $this->json(['message' => 'Ruta creada'], 201);
        } catch (\Exception $e) {
            // Manejar excepciones, hacer rollback si es necesario, loggear el error, etc.
            $entityManager->rollback();

            return $this->json(['error' => 'Error al procesar la solicitud'], 500);
        }
    }
}
