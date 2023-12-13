<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[UniqueEntity(fields: ['email'], message: 'There is already an account with this email')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180, unique: true)]
    private ?string $email = null;

    #[ORM\Column]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    private ?string $password = null;

    #[ORM\Column(length: 255)]
    private ?string $Firstname = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $Lastname = null;

    #[ORM\OneToMany(mappedBy: 'Owner', targetEntity: Race::class)]
    private Collection $OwnedRace;

    #[ORM\OneToMany(mappedBy: 'Owner', targetEntity: Event::class)]
    private Collection $OwnedEvents;


    #[ORM\Column(nullable: true)]
    private ?string $token = null;

    public function __construct()
    {
        $this->OwnedRace = new ArrayCollection();
        $this->OwnedEvents = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getFirstname(): ?string
    {
        return $this->Firstname;
    }

    public function setFirstname(string $Firstname): static
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

    /**
     * @return Collection<int, Race>
     */
    public function getOwnedRace(): Collection
    {
        return $this->OwnedRace;
    }

    public function addOwnedRace(Race $ownedRace): static
    {
        if (!$this->OwnedRace->contains($ownedRace)) {
            $this->OwnedRace->add($ownedRace);
            $ownedRace->setOwner($this);
        }

        return $this;
    }

    public function removeOwnedRace(Race $ownedRace): static
    {
        if ($this->OwnedRace->removeElement($ownedRace)) {
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

    public function setToken(?string $Token): self
    {
        $this->token = $Token;

        return $this;
    }
}
