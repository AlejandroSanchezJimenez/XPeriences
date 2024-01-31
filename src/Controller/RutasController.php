<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class RutasController extends AbstractController
{
    #[Route('/rutas', name: 'app_rutas')]
    public function index(): Response
    {
        return $this->render('rutas/index.html.twig', [
            'controller_name' => 'RutasController',
        ]);
    }
}
