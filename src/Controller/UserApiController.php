<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;

class UserApiController extends AbstractController
{
    private $tokenStorage;

    public function __construct(TokenStorageInterface $tokenStorage)
    {
        $this->tokenStorage = $tokenStorage;
    }

    #[Route('/usuario/api/crear', name: 'app_usuario_api_add', methods: ['POST'])]
    public function addUsuario(Request $request, EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        // Obtener los datos del usuario (id, email, isVerified) desde $data
        $email = $data['email'];
        $plainpassword = $data['plainpassword'];

        // Crear una nueva entidad de Usuario
        $usuario = new User();
        $usuario->setEmail($email);
        $hashedPassword = $passwordHasher->hashPassword(
            $usuario,
            $plainpassword
        );
        $usuario->setPassword($hashedPassword);
        $usuario->setRoles(['ROLE_GUIA']);

        $entityManager->persist($usuario);
        $entityManager->flush();

        $token = new UsernamePasswordToken($usuario, $hashedPassword, $usuario->getRoles());
        $this->tokenStorage->setToken($token);

        return $this->json(['message' => 'Usuario creado'], 201);
    }

    #[Route('/user/api/guia', name: 'app_user_api_getOne', methods: ['GET'])]
    public function getUsersByRol(UserRepository $userRepository): JsonResponse
    {
        $usuarios = $userRepository->findAll();

        $usuariosGuia = array_filter($usuarios, function ($usuario) {
            return in_array('ROLE_GUIA', $usuario->getRoles());
        });
        foreach ($usuariosGuia as $user) {
            $data[] = [
                'id' => $user->getId(),
                'email' => $user->getEmail()
            ];
        }

        return $this->json($data, 200);
    }

}
