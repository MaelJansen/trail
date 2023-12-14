<?php

namespace App\Entity;

use App\Repository\EventRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: EventRepository::class)]
class Event
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['group1'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['group1'])]
    private ?string $Name = null;

    #[ORM\Column(length: 255)]
    #[Groups(['group1'])]
    private ?string $Address = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Groups(['group1'])]
    private ?\DateTimeInterface $StartDate = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Groups(['group1'])]
    private ?\DateTimeInterface $EndDate = null;

    #[ORM\OneToMany(mappedBy: 'event', targetEntity: Race::class)]
    #[Groups(['group1'])]
    private Collection $Race;

    #[ORM\ManyToOne(inversedBy: 'OwnedEvents')]
    private ?User $Owner = null;

    public function __construct()
    {
        $this->Race = new ArrayCollection();
    }

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

    public function getStartDate(): ?\DateTimeInterface
    {
        return $this->StartDate;
    }

    public function setStartDate(\DateTimeInterface $StartDate): static
    {
        $this->StartDate = $StartDate;

        return $this;
    }

    public function getEndDate(): ?\DateTimeInterface
    {
        return $this->EndDate;
    }

    public function setEndDate(\DateTimeInterface $EndDate): static
    {
        $this->EndDate = $EndDate;

        return $this;
    }

    /**
     * @return Collection<int, Race>
     */
    public function getRace(): Collection
    {
        return $this->Race;
    }

    public function addRace(Race $race): static
    {
        if (!$this->Race->contains($race)) {
            $this->Race->add($race);
            $race->setEvent($this);
        }

        return $this;
    }

    public function removeRace(Race $race): static
    {
        if ($this->Race->removeElement($race)) {
            // set the owning side to null (unless already changed)
            if ($race->getEvent() === $this) {
                $race->setEvent(null);
            }
        }

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
