<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class MountrailController extends AbstractController
{
    #[Route('/{x}', name: 'app_mountrail', requirements: ['x' => '.*'])]
    public function index(): Response
    {
        return $this->render('MounTrail/index.html.twig', [
            'controller_name' => 'MountrailController',
        ]);
    }
}
