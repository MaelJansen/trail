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
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Mapping\Factory\ClassMetadataFactory;
use Symfony\Component\Serializer\Mapping\Loader\AttributeLoader;
use Symfony\Component\Serializer\Normalizer\DateTimeNormalizer;



#[Route('/api', name: 'app_api')]
class ApiController extends AbstractController
{   
    #[Route('/login', name: 'app_api_login', methods: ['POST'])]
    public function login(Request $request, UserRepository $repository, UserPasswordHasherInterface $userPasswordHasher): Response
    {
        $data = json_decode($request->getContent(), true);
        $user = $repository->getOneUser($data['email']);
        $user->setPassword(
            $userPasswordHasher->hashPassword(
                $user,
                $data['password']
            )
        );
        $allUsers = $repository->findAll();
        $exist = FALSE;
        foreach ($allUsers as $userTest){
            if($data['email'] === $userTest->getEmail() && $user->getPassword() === $userTest->getPassword()){
                $exist = True;
            }
        }
        if (!$exist) {
            return $this->json([
                'message' => 'missing credentials',
                'user' => $user
            ], Response::HTTP_UNAUTHORIZED);
        }
        $token = uniqid();
        $user->setToken($token);
        $repository->save($user, true);
             
        return $this->json([
            'user'  => $user->getUserIdentifier(),
            'userId' => $user->getId(),
            'token' => $token,
        ]);
    }


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

    #[Route('/events', name: "iterate_event", methods: ['GET'])]
    public function iterateEvents(Request $request, EntityManagerInterface $entityManager, SerializerInterface $serializer): Response
    {
        $queryBuilder = $entityManager->createQueryBuilder()
            ->select('e')
            ->from(Event::class, 'e')
            ->orderBy('e.id', 'ASC')
            ->setMaxResults(10);

        $events = $queryBuilder->getQuery()->getResult();

        $serializer = new Serializer([new DateTimeNormalizer(['format' => 'd-m-Y']), new ObjectNormalizer()]);

        $jsonContent = $serializer->normalize($events, null, [AbstractNormalizer::ATTRIBUTES => ['Name', 'id', 'Address', 'StartDate', 'EndDate', 'Race' => ['id', 'Name', 'Address', 'Distance', 'PositiveDifference', 'NegativeDifference']]]);

        return $this->json($jsonContent);
    }

    #[Route('/eventsCond', name: "iterate_event_cond", methods: ['GET'])]
    public function iterateEventsCond(Request $request, EntityManagerInterface $entityManager, SerializerInterface $serializer): Response
    {
        $queryBuilder = $entityManager->createQueryBuilder()
            ->select('e')
            ->from(Event::class, 'e')
            ->orderBy('e.id', 'ASC');

        $events = $queryBuilder->getQuery()->getResult();

        $serializer = new Serializer([new DateTimeNormalizer(['format' => 'd-m-Y']), new ObjectNormalizer()]);

        $jsonContent = $serializer->normalize($events, null, [AbstractNormalizer::ATTRIBUTES => ['id', 'Name']]);

        return $this->json($jsonContent);
    }

    #[Route('/event/new', name: 'app_event_new', methods: ['GET', 'POST'])]
    public function newEvent(Request $request, EntityManagerInterface $entityManager, SerializerInterface $serializer): Response
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

        $event->setName($data['name']);
        $event->setAddress($data['address']);
        $event->setStartDate($data['startDate']);
        $event->setEndDate($data['endDate']);
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
        $event = $repository->findOneBy(['id' => $id]);

        $serializer = new Serializer([new DateTimeNormalizer(['format' => 'd-m-Y']), new ObjectNormalizer()]);

        $jsonContent = $serializer->normalize($event, null, [AbstractNormalizer::ATTRIBUTES => ['Name', 'id', 'Address', 'StartDate', 'EndDate', 'Owner'=>['id','Firstname','Lastname','email'], 'Race' => ['id', 'Name', 'Address', 'Distance', 'PositiveDifference', 'NegativeDifference']]]);
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

    #[Route('/racesCond', name: "iterate_race_cond", methods: ['GET'])]
    public function iterateRacesCond(Request $request, EntityManagerInterface $entityManager, SerializerInterface $serializer): Response
    {
        $queryBuilder = $entityManager->createQueryBuilder()
            ->select('r')
            ->from(Race::class, 'r')
            ->orderBy('r.id', 'ASC');

        $races = $queryBuilder->getQuery()->getResult();

        $jsonContent = $serializer->normalize($races, null, [AbstractNormalizer::ATTRIBUTES => ['id', 'Name']]);

        return $this->json($jsonContent);
    }

    #[Route('/link', name: 'app_link_event_race', methods: ['POST'])]
    public function createLink(Request $request, EntityManagerInterface $entityManager, RaceRepository $raceRepository, EventRepository $eventRepository): Response
    {
        $data = json_decode($request->getContent(), true);
        $eventId = $data['event'];
        $raceId = $data['race'];

        if ($data['race'] === null || $data['event'] === null) {
            return $this->json([
                'message' => 'missing credentials'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $race = $raceRepository->getOneRace($raceId);
        $event = $eventRepository->getOneEvent($eventId);


        $race->setEvent($event);
        $event->addRace($race);

        $entityManager->flush();

        return $this->json([
            'message' => 'Link created successfully',
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
    public function showRace(Race $race, Request $request, SerializerInterface $serializer, EntityManagerInterface $entityManager): Response
    {
        /*return $this->render('race/show.html.twig', [  
            'race' => $race,
        ]);*/
        $id = $request->get('id');
        $repository = $entityManager->getRepository(Race::class);
        $race = $repository->find($id);
        $jsonContent = $serializer->serialize($race, 'json', [
            'circular_reference_handler' => function ($object) {
                return $object->getId();
            }
        ]);
        return $this->json($jsonContent);
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
