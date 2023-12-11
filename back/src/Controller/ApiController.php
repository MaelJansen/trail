<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\User;
use Symfony\Component\Routing\Annotation\Route;
use FOS\RestBundle\Controller\Annotations\View;
use Nelmio\ApiDocBundle\Annotation\Security;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use App\Security\AccessTokenHandler;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use App\Form\RegistrationFormType;
use App\Security\UserAuthenticator;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Http\Authentication\UserAuthenticatorInterface;

#[Route('/api', name: 'app_api')]
class ApiController extends AbstractController
{
    #[OA\Post(
        summary: "Login user"
    )]
    #[OA\Response(
        response: 200,
        description: "user token",
        content: new OA\JsonContent(
            example:'token : 1ec63c1099c9a5b3fe88745b694055375ddc2ec95a5b63506089cb3e23d76e29'
        )
    )]
    #[OA\Parameter(
        name: 'mail',
        description: 'User username',
        required: true,
        schema: new OA\Schema(type: 'string')
    )]
    #[OA\Parameter(
        name: 'password',
        description: 'User password',
        required: true,
        schema: new OA\Schema(type: 'string')
    )]
    #[Route("/login", name: "_login", methods: ["POST"])]
    public function login(#[CurrentUser] ?User $user, AccessTokenHandler $accessTokenHandler): Response
    {
        if (null === $user) {
            return new JsonResponse(["error" => "User not found"], 400);
        }
        return new JsonResponse(["token" => $accessTokenHandler->createAccessToken($user)]);

     #[OA\Post(
        summary: "Register user"
    )]
    #[OA\Parameter(
        name: 'email',
        description: 'Email',
        required: true,
        schema: new OA\Schema(type: 'mail')
    )]
    #[OA\Parameter(
        name: 'Firstname',
        description: 'Firstname',
        required: true,
        schema: new OA\Schema(type: 'string')
    )]
    #[OA\Parameter(
        name: 'Lastname',
        description: 'Lastname',
        required: true,
        schema: new OA\Schema(type: 'srting')
    )]
    #[OA\Parameter(
        name: 'password',
        description: 'User password',
        required: true,
        schema: new OA\Schema(type: 'string')
    )]
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
}