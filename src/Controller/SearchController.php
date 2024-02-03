<?php

namespace App\Controller;

use App\Repository\TourRepository;
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
    public function moreInfoTour(TourRepository $tourRep): Response
    {
        if (isset($_GET['id'])) {
            $tour = $tourRep->find($_GET['id']);
        } else {
            echo "No se proporcionó un ID de tour en la URL.";
        }
        return $this->render('search/moreInfo.html.twig', [
            'tour' => $tour
        ]);
    }
}
