<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
class User
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $Email = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $Firstname = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $Lastname = null;

    #[ORM\Column(nullable: true)]
    private ?bool $IsAdmin = null;

    #[ORM\Column(nullable: true)]
    private ?bool $IsOrganiser = null;

    #[ORM\Column(length: 255)]
    private ?string $Password = null;

    #[ORM\Column(length: 255)]
    private ?string $Username = null;

    #[ORM\OneToMany(mappedBy: 'Owner', targetEntity: Race::class)]
    private Collection $OwnedRaces;

    #[ORM\OneToMany(mappedBy: 'Owner', targetEntity: Event::class)]
    private Collection $OwnedEvents;

    public function __construct()
    {
        $this->OwnedRaces = new ArrayCollection();
        $this->OwnedEvents = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->Email;
    }

    public function setEmail(string $Email): static
    {
        $this->Email = $Email;

        return $this;
    }

    public function getFirstname(): ?string
    {
        return $this->Firstname;
    }

    public function setFirstname(?string $Firstname): static
    {
        $this->Firstname = $Firstname;

        return $this;
    }

    public function getLastname(): ?string
    {
        return $this->Lastname;
    }

    public function setLastname(?string $Lastname): static
    {
        $this->Lastname = $Lastname;

        return $this;
    }

    public function isIsAdmin(): ?bool
    {
        return $this->IsAdmin;
    }

    public function setIsAdmin(?bool $IsAdmin): static
    {
        $this->IsAdmin = $IsAdmin;

        return $this;
    }

    public function isIsOrganiser(): ?bool
    {
        return $this->IsOrganiser;
    }

    public function setIsOrganiser(?bool $IsOrganiser): static
    {
        $this->IsOrganiser = $IsOrganiser;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->Password;
    }

    public function setPassword(string $Password): static
    {
        $this->Password = $Password;

        return $this;
    }

    public function getUsername(): ?string
    {
        return $this->Username;
    }

    public function setUsername(string $Username): static
    {
        $this->Username = $Username;

        return $this;
    }

    /**
     * @return Collection<int, Race>
     */
    public function getOwnedRaces(): Collection
    {
        return $this->OwnedRaces;
    }

    public function addOwnedRace(Race $ownedRace): static
    {
        if (!$this->OwnedRaces->contains($ownedRace)) {
            $this->OwnedRaces->add($ownedRace);
            $ownedRace->setOwner($this);
        }

        return $this;
    }

    public function removeOwnedRace(Race $ownedRace): static
    {
        if ($this->OwnedRaces->removeElement($ownedRace)) {
            // set the owning side to null (unless already changed)
            if ($ownedRace->getOwner() === $this) {
                $ownedRace->setOwner(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Event>
     */
    public function getOwnedEvents(): Collection
    {
        return $this->OwnedEvents;
    }

    public function addOwnedEvent(Event $ownedEvent): static
    {
        if (!$this->OwnedEvents->contains($ownedEvent)) {
            $this->OwnedEvents->add($ownedEvent);
            $ownedEvent->setOwner($this);
        }

        return $this;
    }

    public function removeOwnedEvent(Event $ownedEvent): static
    {
        if ($this->OwnedEvents->removeElement($ownedEvent)) {
            // set the owning side to null (unless already changed)
            if ($ownedEvent->getOwner() === $this) {
                $ownedEvent->setOwner(null);
            }
        }

        return $this;
    }
}
