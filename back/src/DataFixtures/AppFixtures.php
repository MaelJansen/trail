<?php

namespace App\DataFixtures;

use App\Entity\User;
use App\Entity\Event;
use App\Entity\Race;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public $NB_USERS = 10;
    public $NB_EVENTS = 5;
    public $NB_RACES = 20;
    public function load(ObjectManager $manager): void
    {
        $roles = ['ROLE_USER', 'ROLE_ORGANIZER', 'ROLE_ADMIN'];
        $users = [];
        $events = [];
        for ($i = 0; $i < $this->NB_USERS; $i++) {
            $user = (new User())
                ->setEmail('user' . $i . '@gmail.com')
                ->setPassword('password' . $i)
                ->setFirstname('firstname' . $i)
                ->setLastname('lastname' . $i)
                ->setRoles([$roles[array_rand($roles)]]);
            if ($user->getRoles()[0] !== 'ROLE_USER')
                array_push($users, $user);
            $manager->persist($user);
        }
        $manager->flush();

        for ($i = 0; $i < $this->NB_EVENTS; $i++) {
            $event = (new Event())
                ->setName('event' . $i)
                ->setStartDate(new \DateTime())
                ->setEndDate(new \DateTime())
                ->setAddress('address' . $i)
                ->setOwner($manager->getRepository(User::class)->findOneBy(['id' => $users[array_rand($users)]->getId()]));
            array_push($events, $event);
            $manager->persist($event);
        }
        $manager->flush();

        for ($i = 0; $i < $this->NB_RACES; $i++) {
            $race = (new Race())
                ->setName('race' . $i)
                ->setAddress('address' . $i)
                ->setDistance(10)
                ->setPositiveDifference(10)
                ->setNegativeDifference(10)
                ->setEvent($manager->getRepository(Event::class)->findOneBy(['id' => $events[array_rand($events)]->getId()]))
                ->setOwner($manager->getRepository(User::class)->findOneBy(['id' => $users[array_rand($users)]->getId()]));
            $manager->persist($race);
        }
        $manager->flush();
    }
}
