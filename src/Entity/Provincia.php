<?php

namespace App\Entity;

use App\Repository\ProvinciaRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ProvinciaRepository::class)]
class Provincia
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 50)]
    private ?string $Nombre = null;

    #[ORM\Column(length: 50)]
    private ?string $codProv = null;

    #[ORM\OneToMany(mappedBy: 'Provincia', targetEntity: Localidad::class, orphanRemoval: true)]
    private Collection $localidads;

    public function __construct()
    {
        $this->localidads = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNombre(): ?string
    {
        return $this->Nombre;
    }

    public function setNombre(string $Nombre): static
    {
        $this->Nombre = $Nombre;

        return $this;
    }

    public function getCodProv(): ?string
    {
        return $this->codProv;
    }

    public function setCodProv(string $codProv): static
    {
        $this->codProv = $codProv;

        return $this;
    }

    /**
     * @return Collection<int, Localidad>
     */
    public function getLocalidads(): Collection
    {
        return $this->localidads;
    }

    public function addLocalidad(Localidad $localidad): static
    {
        if (!$this->localidads->contains($localidad)) {
            $this->localidads->add($localidad);
            $localidad->setProvincia($this);
        }

        return $this;
    }

    public function removeLocalidad(Localidad $localidad): static
    {
        if ($this->localidads->removeElement($localidad)) {
            // set the owning side to null (unless already changed)
            if ($localidad->getProvincia() === $this) {
                $localidad->setProvincia(null);
            }
        }

        return $this;
    }
}
