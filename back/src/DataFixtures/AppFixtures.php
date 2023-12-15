<?php

namespace App\DataFixtures;

use App\Entity\User;
use App\Entity\Event;
use App\Entity\Race;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use DateTime;


class AppFixtures extends Fixture
{
    public $NB_USERS = 10;
    public $NB_EVENTS = 20;
    public $NB_RACES = 20;
    public function load(ObjectManager $manager): void
    {
        $roles = ['ROLE_USER', 'ROLE_ORGANIZER', 'ROLE_ADMIN'];
        $users = [];
        $events = [];
        for ($i = 0; $i < $this->NB_USERS; $i++) {
            $user = (new User())
                ->setEmail('user' . $i . '@gmail.com')
                ->setPassword(hash('sha256', 'password' . $i))
                ->setFirstname('firstname' . $i)
                ->setLastname('lastname' . $i)
                ->setRoles([$roles[array_rand($roles)]]);
            if ($user->getRoles()[0] !== 'ROLE_USER')
                array_push($users, $user);
            $manager->persist($user);
        }
        $manager->flush();

        for ($i = 0; $i < $this->NB_EVENTS; $i++) {
            $date = new DateTime('now');
            $datef = $date->modify('+' . rand(1, 7) . ' days');
            $event = (new Event())
                ->setName('event' . $i)
                ->setStartDate($date)
                ->setEndDate($datef)
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
                ->setDistance(rand(1, 100))
                ->setPositiveDifference(rand(1, 100))
                ->setNegativeDifference(rand(1, 100))
                ->setEvent($manager->getRepository(Event::class)->findOneBy(['id' => $events[array_rand($events)]->getId()]))
                ->setOwner($manager->getRepository(User::class)->findOneBy(['id' => $users[array_rand($users)]->getId()]));
            $manager->persist($race);
        }
        $manager->flush();
    }
}
