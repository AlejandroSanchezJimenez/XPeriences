<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class HistorialController extends AbstractController
{
    #[Route('/perfil', name: 'app_historial')]
    public function index(): Response
    {
        return $this->render('historial/index.html.twig', [
            'controller_name' => 'HistorialController',
        ]);
    }
}
