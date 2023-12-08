<?php

namespace App\Entity;

use App\Repository\RaceRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: RaceRepository::class)]
class Race
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $Name = null;

    #[ORM\Column(length: 255)]
    private ?string $Address = null;

    #[ORM\Column(nullable: true)]
    private ?float $Distance = null;

    #[ORM\Column(nullable: true)]
    private ?float $PositiveDifference = null;

    #[ORM\Column(nullable: true)]
    private ?float $NegativeDifference = null;

    #[ORM\ManyToOne(inversedBy: 'Race')]
    private ?Event $event = null;

    #[ORM\ManyToOne(inversedBy: 'OwnedRaces')]
    private ?User $Owner = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->Name;
    }

    public function setName(string $Name): static
    {
        $this->Name = $Name;

        return $this;
    }

    public function getAddress(): ?string
    {
        return $this->Address;
    }

    public function setAddress(string $Address): static
    {
        $this->Address = $Address;

        return $this;
    }

    public function getDistance(): ?float
    {
        return $this->Distance;
    }

    public function setDistance(float $Distance): static
    {
        $this->Distance = $Distance;

        return $this;
    }

    public function getPositiveDifference(): ?float
    {
        return $this->PositiveDifference;
    }

    public function setPositiveDifference(float $PositiveDifference): static
    {
        $this->PositiveDifference = $PositiveDifference;

        return $this;
    }

    public function getNegativeDifference(): ?float
    {
        return $this->NegativeDifference;
    }

    public function setNegativeDifference(float $NegativeDifference): static
    {
        $this->NegativeDifference = $NegativeDifference;

        return $this;
    }

    public function getEvent(): ?Event
    {
        return $this->event;
    }

    public function setEvent(?Event $event): static
    {
        $this->event = $event;

        return $this;
    }

    public function getOwner(): ?User
    {
        return $this->Owner;
    }

    public function setOwner(?User $Owner): static
    {
        $this->Owner = $Owner;

        return $this;
    }
}
