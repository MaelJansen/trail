<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use App\Repository\UserRepository;
use App\Repository\EventRepository;
use App\Repository\RaceRepository;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\User;
use App\Entity\Event;
use App\Entity\Race;
use App\Form\EventType;
use App\Form\RaceType;
use Symfony\Component\Routing\Annotation\Route;
use Nelmio\ApiDocBundle\Annotation\Security;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use App\Security\AccessTokenHandler;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use App\Form\RegistrationFormType;
use App\Security\UserAuthenticator;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Http\Authentication\UserAuthenticatorInterface;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api', name: 'app_api')]
class ApiController extends AbstractController
{   
    #[Route("/register", name: "_register", methods: ["POST"])]
    public function register(Request $request, UserPasswordHasherInterface $userPasswordHasher, UserAuthenticatorInterface $userAuthenticator, UserAuthenticator $authenticator, EntityManagerInterface $entityManager): Response
    {
        $data = json_decode($request->getContent(), true);
        $user = new User;

        $user->setEmail($data['email']);
        $user->setFirstname($data['Firstname']);
        $user->setLastname($data['Lastname']);

        $user->setPassword(
            $userPasswordHasher->hashPassword(
                $user,
                $data['password']
            )
        );

        $entityManager->persist($user);
        $entityManager->flush();
        // do anything else you need here, like send an email

        return $userAuthenticator->authenticateUser(
            $user,
            $authenticator,
            $request
        );
    }

    #[Route('/event', name: 'app_event_index', methods: ['GET'])]
    public function eventIndex(EventRepository $eventRepository, SerializerInterface $serializer): Response
    {
        /*$events = $eventRepository->findAll();
        $res = [];
        foreach ($events as $event){
            $res[] = [
                'id' => $event->getId(),
                'name' => $event->getName(),
                'address' => $event->getAddress(),
                'startDate' => $event->getStartDate()->format('Y-m-d H:i:s'),
                'endDate' => $event->getEndDate()->format('Y-m-d H:i:s'),
                'races' => $event->getRace(),
                'owner' => $event->getOwner()
            ];
        }
        $json = json_encode($res, JSON_PRETTY_PRINT);
        return $this->json($json);*/
        $evenements = $eventRepository->findAll();
        $jsonContent = $serializer->serialize($evenements, 'json', [
            'circular_reference_handler' => function ($object) {
                return $object->getId();
            }
        ]);
        return $this->json($jsonContent);
    }

    #[Route('/event/new', name: 'app_event_new', methods: ['GET', 'POST'])]
    public function newEvent(Request $request, EntityManagerInterface $entityManager): Response
    {
        // Vérifiez si l'utilisateur est connecté
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        // Vérifiez si l'utilisateur est un administrateur
        $valid = false;
        $roles = ['ROLE_ADMIN', 'ROLE_ORGANIZER'];
        foreach($roles as $singleRole){
            if ($this->isGranted($singleRole)) {
                $valid = True;
            }
        }
        if (!$valid) {
            throw $this->createAccessDeniedException();
        }

        $data = json_decode($request->getContent(), true);
        $event = new Event;

        $event->setEmail($data['name']);
        $event->setAddress($data['address']);
        $event->setSartDate($data['startDate']);
        $event->setEndDate($data['endDate']);
        $event->setRace($data['race']);
        $event->setOwner($data['owner']);

        if (1===1){
            $entityManager->persist($event);
            $entityManager->flush();
        }

        $jsonContent = $serializer->serialize($event, 'json', [
            'circular_reference_handler' => function ($object) {
                return $object->getId();
            }
        ]);
        return $this->json($jsonContent);
        /*$event = new Event();
        $form = $this->createForm(EventType::class, $event);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($event);
            $entityManager->flush();

            return $this->redirectToRoute('app_event_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('event/new.html.twig', [
            'event' => $event,
            'form' => $form,
        ]);*/
    }

    #[Route('/event/{id}', name: 'app_event_show', methods: ['GET'])]
    public function showEvent(EventRepository $eventRepository, Request $request, SerializerInterface $serializer, EntityManagerInterface $entityManager): Response
    {
        /*return $this->render('event/show.html.twig', [
            'event' => $event,
        ]);*/
        $id = $request->get('id');
        $repository = $entityManager->getRepository(Event::class);
        $evenements = $repository->find($id);
        $jsonContent = $serializer->serialize($evenements, 'json', [
            'circular_reference_handler' => function ($object) {
                return $object->getId();
            }
        ]);
        return $this->json($jsonContent);
    }

    #[Route('/event/edit/{id}', name: 'app_event_edit', methods: ['GET', 'POST'])]
    public function editEvent(Request $request, Event $event, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(EventType::class, $event);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return $this->redirectToRoute('app_event_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('event/edit.html.twig', [
            'event' => $event,
            'form' => $form,
        ]);
    }

    #[Route('/event/delete/{id}', name: 'app_event_delete', methods: ['POST'])]
    public function deleteEvent(Request $request, Event $event, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$event->getId(), $request->request->get('_token'))) {
            $entityManager->remove($event);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_event_index', [], Response::HTTP_SEE_OTHER);
    }

    #[Route('/race', name: 'app_race_index', methods: ['GET'])]
    public function raceIndex(RaceRepository $raceRepository): Response
    {
        return $this->render('race/index.html.twig', [
            'races' => $raceRepository->findAll(),
        ]);
    }

    #[Route('/race/new', name: 'app_race_new', methods: ['GET', 'POST'])]
    public function newRace(Request $request, EntityManagerInterface $entityManager): Response
    {
        
        // Vérifiez si l'utilisateur est connecté
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        // Vérifiez si l'utilisateur est un administrateur
        $this->denyAccessUnlessGranted('ROLE_ADMIN');
        
        $race = new Race();
        $form = $this->createForm(RaceType::class, $race);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($race);
            $entityManager->flush();

            return $this->redirectToRoute('app_race_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('race/new.html.twig', [
            'race' => $race,
            'form' => $form,
        ]);
    }

    #[Route('/race/{id}', name: 'app_race_show', methods: ['GET'])]
    public function showRace(Race $race): Response
    {
        return $this->render('race/show.html.twig', [
            'race' => $race,
        ]);
    }

    #[Route('/race/edit/{id}', name: 'app_race_edit', methods: ['GET', 'POST'])]
    public function editRace(Request $request, Race $race, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(RaceType::class, $race);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return $this->redirectToRoute('app_race_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('race/edit.html.twig', [
            'race' => $race,
            'form' => $form,
        ]);
    }

    #[Route('/race/delete/{id}', name: 'app_race_delete', methods: ['POST'])]
    public function deleteRace(Request $request, Race $race, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$race->getId(), $request->request->get('_token'))) {
            $entityManager->remove($race);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_race_index', [], Response::HTTP_SEE_OTHER);
    }
}
