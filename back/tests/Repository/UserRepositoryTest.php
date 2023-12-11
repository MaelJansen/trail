<?php

namespace Tests\Repository;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use App\DataFixtures\UserFixture;

class UserRepositoryTest extends KernelTestCase
{
    private UserRepository $userRepository;

    public function setUp(): void
    {
        parent::setUp();
        self::bootKernel();
        $this->userRepository = self::getContainer()->get(UserRepository::class);
    }

    public function testCount(): void
    {
        $users = $this->userRepository->count([]);
        $this->assertEquals(10, $users);
    }

    public function testFindAll(): void
    {
        $users = $this->userRepository->findAll();
        $this->assertCount(10, $users);
    }
}