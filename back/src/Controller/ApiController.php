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
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Security\Http\Authentication\UserAuthenticatorInterface;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Mapping\Factory\ClassMetadataFactory;
use Symfony\Component\Serializer\Mapping\Loader\AttributeLoader;
use Symfony\Component\Serializer\Normalizer\DateTimeNormalizer;
use Symfony\Component\Validator\Validator\ValidatorInterface;





#[Route('/api', name: 'app_api')]
class ApiController extends AbstractController
{   
    #[Route('/login', name: 'app_api_login', methods: ['POST'])]
    public function login(Request $request, UserRepository $repository): Response
    {
        $data = json_decode($request->getContent(), true);
        $requestPassword = $data['password'];
        $requestUser = $data['email'];
        $user = $repository->getOneUser($requestUser);

        if (!$user || !$requestPassword ||!$requestUser) {
            return $this->json([
                'message' => 'missing credentials',
                'user' => $user
            ], Response::HTTP_UNAUTHORIZED);
        }
        // $user->setPassword(  
        //     $userPasswordHasher->hashPassword(
        //         $user,
        //         $data['password']
        //     )
        // );
     
        $passwordUser = $user->getPassword();
        
        if($passwordUser === hash('sha256', $requestPassword)){
            $token = uniqid();
            $user->setToken($token);
            $repository->save($user, true);
             
            return $this->json([
                'user'  => $user->getUserIdentifier(),
                'userId' => $user->getId(),
                'token' => $token,
            ]);
        }

        return $this->json([
            'message' => 'wrong password',
            'user' => $user
        ], Response::HTTP_UNAUTHORIZED);
        // $allUsers = $repository->findAll();
        // $exist = FALSE;
        // foreach ($allUsers as $userTest){
        //     if($data['email'] === $userTest->getEmail() && $user->getPassword() === $userTest->getPassword()){
        //         $exist = True;
        //     }
        // }
        
        
    }


    #[Route("/register", name: "_register", methods: ["POST"])]
    public function register(Request $request, UserAuthenticatorInterface $userAuthenticator, UserAuthenticator $authenticator, EntityManagerInterface $entityManager): Response
    {
        $data = json_decode($request->getContent(), true);
        $user = new User;

        $user->setEmail($data['email']);
        $user->setFirstname($data['Firstname']);
        $user->setLastname($data['Lastname']);

        $user->setPassword(hash('sha256', $data['password']));

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
        $page = $request->query->getInt('page', 1); // Get the current page number from the request query parameters
        $limit = 10; // Set the maximum number of results per page to 10
        $startIndex = ($page - 1) * $limit; // Calculate the offset

        $queryBuilder = $entityManager->createQueryBuilder()
            ->select('e')
            ->from(Event::class, 'e')
            ->orderBy('e.id', 'ASC')
            ->setFirstResult($startIndex) // Calculate the offset based on the current page and limit
            ->setMaxResults($limit); // Set the maximum number of results to fetch

        $events = $queryBuilder->getQuery()->getResult();

        $queryBuilder = $entityManager->createQueryBuilder()
        ->select('COUNT(e) as total')
        ->from(Event::class, 'e')
        ->orderBy('e.id', 'ASC');

        $nbPages = $queryBuilder->getQuery()->getSingleScalarResult();

        $serializer = new Serializer([new DateTimeNormalizer(['format' => 'd-m-Y']), new ObjectNormalizer()]);

        $jsonContent['events'] = $serializer->normalize($events, null, [AbstractNormalizer::ATTRIBUTES => ['Name', 'id', 'Address', 'StartDate', 'EndDate', 'Race' => ['id', 'Name', 'Address', 'Distance', 'PositiveDifference', 'NegativeDifference']]]);
        $jsonContent['nbPages'] = ceil($nbPages/$limit); // Add nbPages to the JSON response


        return $this->json($jsonContent);
    }

    #[Route('/myEvents', name: "iterate_my_event", methods: ['GET'])]
    public function iterateMyEvents(Request $request, EntityManagerInterface $entityManager, SerializerInterface $serializer): Response
    {
        $token = $request->query->get('token');
        $page = $request->query->getInt('page', 1); // Get the current page number from the request query parameters
        $limit = 10; // Set the maximum number of results per page to 10
        $startIndex = ($page - 1) * $limit; // Calculate the offset
        $repository = $entityManager->getRepository(User::class);
        $user = $repository->getUserByToken($token);

        $queryBuilder = $entityManager->createQueryBuilder()
            ->select('e')
            ->from(Event::class, 'e')
            ->orderBy('e.id', 'ASC')
            ->setFirstResult($startIndex) // Calculate the offset based on the current page and limit
            ->setMaxResults($limit) // Set the maximum number of results to fetch
            ->where('e.Owner = :user')
            ->setParameter('user', $user);

        $events = $queryBuilder->getQuery()->getResult();

        $queryBuilder = $entityManager->createQueryBuilder()
        ->select('COUNT(e) as total')
        ->from(Event::class, 'e')
        ->orderBy('e.id', 'ASC')
        ->where('e.Owner = :user')
        ->setParameter('user', $user);

        $nbPages = $queryBuilder->getQuery()->getSingleScalarResult();

        $serializer = new Serializer([new DateTimeNormalizer(['format' => 'd-m-Y']), new ObjectNormalizer()]);

        $jsonContent['events'] = $serializer->normalize($events, null, [AbstractNormalizer::ATTRIBUTES => ['Name', 'id', 'Address', 'StartDate', 'EndDate', 'Race' => ['id', 'Name', 'Address', 'Distance', 'PositiveDifference', 'NegativeDifference']]]);
        $jsonContent['nbPages'] = ceil($nbPages/$limit); // Add nbPages to the JSON response


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

        $queryBuilder = $entityManager->createQueryBuilder()
        ->select('COUNT(e) as total')
        ->from(Event::class, 'e')
        ->orderBy('e.id', 'ASC');

        $nbPages = $queryBuilder->getQuery()->getSingleScalarResult();

        $serializer = new Serializer([new DateTimeNormalizer(['format' => 'd-m-Y']), new ObjectNormalizer()]);

        $jsonContent = $serializer->normalize($events, null, [AbstractNormalizer::ATTRIBUTES => ['id', 'Name']]);

        return $this->json($jsonContent);
    }

    #[Route('/event/new', name: 'app_event_new', methods: ['POST'])]
    public function newEvent(Request $request, EntityManagerInterface $entityManager, SerializerInterface $serializer, ValidatorInterface $validator): Response
    {
        $data = json_decode($request->getContent(), true);
        $event = new Event;
        $event->setName($data['name']);
        $event->setAddress($data['address']);
        $event->setStartDate(new \DateTime($data['startDate']));
        $event->setEndDate(new \DateTime($data['endDate']));
        $repository = $entityManager->getRepository(User::class);
        $user = $repository->getUserByToken($data['token']);
        $event->setOwner($user);
        $user->addOwnedEvent($event);

        // Validate the form data
        $errors = $validator->validate($event);
        if (count($errors) > 0) {
            print_r($errors);
            // Return the validation errors as JSON response
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getMessage();
            }
            return $this->json(['errors' => $errorMessages], Response::HTTP_BAD_REQUEST);
        }

        // Persist the event in the database
        $entityManager->persist($event);
        $entityManager->flush();

        // Serialize the event object
        $serializedEvent = $serializer->normalize($event, null, [
            AbstractNormalizer::ATTRIBUTES => ['id', 'name', 'startDate', 'endDate', 'address']
        ]);

        // Return the serialized event as JSON response
        return $this->json($serializedEvent);
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

    #[Route('/event/edit', name: 'app_event_edit', methods: ['POST'])]
    public function editEvent(Request $request, EntityManagerInterface $entityManager): Response
    {
        $data = json_decode($request->getContent(), true);
        $id = $data['id'];
        $repository = $entityManager->getRepository(Event::class);
        $event = $repository->findOneBy(['id' => $id]);
        $event->setName($data['name']);
        $event->setAddress($data['address']);
        $event->setStartDate(new \DateTime($data['startDate']));
        $event->setEndDate(new \DateTime($data['endDate']));

        $entityManager->flush();

        return $this->json([
            'message' => 'Event updated successfully',
        ]);
    }

    #[Route('/event/delete', name: 'app_event_delete', methods: ['POST'])]
    public function deleteEvent(Request $request, EntityManagerInterface $entityManager): Response
    {
        $data = json_decode($request->getContent(), true);
        $id = $data['id'];
        $repository = $entityManager->getRepository(Event::class);
        $event = $repository->findOneBy(['id' => $id]);
        $entityManager->remove($event);
        $entityManager->flush();

        return $this->json([
            'message' => 'Event deleted successfully',
        ]);
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


    #[Route('/race/new', name: 'app_race_new', methods: ['POST'])]
    public function newRace(Request $request, EntityManagerInterface $entityManager, SerializerInterface $serializer, ValidatorInterface $validator): Response
    {

        $data = json_decode($request->getContent(), true);
        $race = new Race;
        $race->setName($data['name']);
        $race->setAddress($data['address']);
        $race->setDistance($data['distance']);
        $race->setPositiveDifference($data['positiveHeightDifference']);
        $race->setNegativeDifference($data['negativeHeightDifference']);   

        // Validate the form data
        $errors = $validator->validate($race);
        if (count($errors) > 0) {
            print_r($errors);
            // Return the validation errors as JSON response
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getMessage();
            }
            return $this->json(['errors' => $errorMessages], Response::HTTP_BAD_REQUEST);
        }

        // Persist the race in the database
        $entityManager->persist($race);
        $entityManager->flush();



        // Serialize the race object
        $serializedRace = $serializer->normalize($race, null, [
            AbstractNormalizer::ATTRIBUTES => ['id', 'name', 'address', 'distance', 'positiveDifference', 'negativeDifference']
        ]);

        // Return the serialized event as JSON response
        return $this->json($serializedRace);

        
    }

    #[Route('/race/{id}', name: 'app_race_show', methods: ['GET'])]
    public function showRace(Race $race, Request $request, SerializerInterface $serializer, EntityManagerInterface $entityManager): Response
    {
        /*return $this->render('race/show.html.twig', [  
            'race' => $race,
        ]);*/
        $id = $request->get('id');
        $repository = $entityManager->getRepository(Race::class);
        $race = $repository->findOneBy(['id' => $id]);

        $serializer = new Serializer([new DateTimeNormalizer(['format' => 'd-m-Y']), new ObjectNormalizer()]);
        $jsonContent = $serializer->normalize($race, null, [AbstractNormalizer::ATTRIBUTES => ['Name', 'id', 'Address', 'Distance', 'PositiveDifference', 'NegativeDifference', 'Event'=>['id','Name']]]);


        return $this->json($jsonContent);
    }

    #[Route('/race/edit', name: 'app_race_edit', methods: ['POST'])]
    public function editRace(Request $request, EntityManagerInterface $entityManager): Response
    {
        $data = json_decode($request->getContent(), true);
        $id = $data['id'];
        $repository = $entityManager->getRepository(Race::class);
        $race = $repository->findOneBy(['id' => $id]);
        $race->setName($data['name']);
        $race->setAddress($data['address']);
        $race->setDistance($data['distance']);
        $race->setPositiveDifference($data['positiveHeightDifference']);
        $race->setNegativeDifference($data['negativeHeightDifference']);

        $entityManager->flush();
        
        return $this->json([
            'message' => 'Race updated successfully',
        ]);

    }

    #[Route('/race/delete', name: 'app_race_delete', methods: ['POST'])]
    public function deleteRace(Request $request, EntityManagerInterface $entityManager): Response
    {
        $data = json_decode($request->getContent(), true);
        $id = $data['id'];
        $repository = $entityManager->getRepository(Race::class);
        $race = $repository->findOneBy(['id' => $id]);
        $entityManager->remove($race);
        $entityManager->flush();

        return $this->json([
            'message' => 'Race deleted successfully',
        ]);

    }

    #[Route('/role', name: 'app_role', methods: ['POST'])]
    public function role(Request $request, EntityManagerInterface $entityManager): Response
    {
        $data = json_decode($request->getContent(), true); 
        $repository = $entityManager->getRepository(User::class);
        $user = $repository->getUserByToken($data['token']);
        return $this->json([
            'role' => $user->getRoles()
        ]);
    }
}
