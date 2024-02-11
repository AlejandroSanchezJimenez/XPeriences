<?php

namespace App\Controller;

use App\Repository\TourRepository;
use App\Repository\ValoracionRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class SearchController extends AbstractController
{
    #[Route('/searchPanel', name: 'app_search')]
    public function index(): Response
    {
        return $this->render('search/index.html.twig', [
            'controller_name' => 'SearchController',
        ]);
    }

    #[Route('/searchPanel/tour', name: 'app_moreInfo')]
    public function moreInfoTour(TourRepository $tourRep, ValoracionRepository $valRep): Response
    {
        if (isset($_GET['id'])) {
            $tour = $tourRep->find($_GET['id']);
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

            $fotoB64 = [];

            foreach ($tour->getRuta()->getRutaItems() as $items) {
                $fotoBlob = $items->getItem()->getFoto();
                rewind($fotoBlob);
                $foto = stream_get_contents($fotoBlob);
                array_push($fotoB64,$foto);
            }
        } else {
            echo "No se proporcionó un ID de tour en la URL.";
        }
        return $this->render('search/moreInfo.html.twig', [
            'tour' => $tour,
            'valoracion' => $media,
            'fotos' => $fotoB64
        ]);
    }
}
