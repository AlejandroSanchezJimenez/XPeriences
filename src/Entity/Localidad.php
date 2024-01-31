<?php

namespace App\Entity;

use App\Repository\LocalidadRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: LocalidadRepository::class)]
class Localidad
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 50)]
    private ?string $Nombre = null;

    #[ORM\Column(length: 50)]
    private ?string $codProv = null;

    #[ORM\ManyToOne(inversedBy: 'localidads')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Provincia $Provincia = null;

    #[ORM\OneToMany(mappedBy: 'Localidad', targetEntity: Ruta::class, orphanRemoval: true)]
    private Collection $rutas;

    public function __construct()
    {
        $this->rutas = new ArrayCollection();
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

    public function getProvincia(): ?Provincia
    {
        return $this->Provincia;
    }

    public function setProvincia(?Provincia $Provincia): static
    {
        $this->Provincia = $Provincia;

        return $this;
    }

    /**
     * @return Collection<int, Ruta>
     */
    public function getRutas(): Collection
    {
        return $this->rutas;
    }

    public function addRuta(Ruta $ruta): static
    {
        if (!$this->rutas->contains($ruta)) {
            $this->rutas->add($ruta);
            $ruta->setLocalidad($this);
        }

        return $this;
    }

    public function removeRuta(Ruta $ruta): static
    {
        if ($this->rutas->removeElement($ruta)) {
            // set the owning side to null (unless already changed)
            if ($ruta->getLocalidad() === $this) {
                $ruta->setLocalidad(null);
            }
        }

        return $this;
    }
}
