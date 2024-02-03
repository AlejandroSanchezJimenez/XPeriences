<?php

namespace App\Entity;

use App\Repository\RutaRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: RutaRepository::class)]
class Ruta
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    private ?string $Titulo = null;

    #[ORM\Column(length: 200)]
    private ?string $Descripcion = null;

    #[ORM\Column(type: Types::BLOB)]
    private $Foto = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $Fecha_ini = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $Fecha_fin = null;

    #[ORM\Column]
    private ?int $Aforo = null;

    #[ORM\Column]
    private array $Programacion = [];

    #[ORM\OneToMany(mappedBy: 'Ruta', targetEntity: RutaItem::class, orphanRemoval: true)]
    private Collection $rutaItems;

    #[ORM\OneToMany(mappedBy: 'Ruta', targetEntity: Tour::class, orphanRemoval: true)]
    private Collection $tours;

    #[ORM\ManyToOne(inversedBy: 'rutas')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Localidad $Localidad = null;

    #[ORM\Column(length: 50)]
    private ?string $PuntoInicio = null;

    public function __construct()
    {
        $this->rutaItems = new ArrayCollection();
        $this->tours = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitulo(): ?string
    {
        return $this->Titulo;
    }

    public function setTitulo(string $Titulo): static
    {
        $this->Titulo = $Titulo;

        return $this;
    }

    public function getDescripcion(): ?string
    {
        return $this->Descripcion;
    }

    public function setDescripcion(string $Descripcion): static
    {
        $this->Descripcion = $Descripcion;

        return $this;
    }

    public function getFoto()
    {
        return $this->Foto;
    }

    public function setFoto($Foto): static
    {
        $this->Foto = $Foto;

        return $this;
    }

    public function getFechaIni(): ?\DateTimeInterface
    {
        return $this->Fecha_ini;
    }

    public function setFechaIni(\DateTimeInterface $Fecha_ini): static
    {
        $this->Fecha_ini = $Fecha_ini;

        return $this;
    }

    public function getFechaFin(): ?\DateTimeInterface
    {
        return $this->Fecha_fin;
    }

    public function setFechaFin(\DateTimeInterface $Fecha_fin): static
    {
        $this->Fecha_fin = $Fecha_fin;

        return $this;
    }

    public function getAforo(): ?int
    {
        return $this->Aforo;
    }

    public function setAforo(int $Aforo): static
    {
        $this->Aforo = $Aforo;

        return $this;
    }

    public function getProgramacion(): array
    {
        return $this->Programacion;
    }

    public function setProgramacion(array $Programacion): static
    {
        $this->Programacion = $Programacion;

        return $this;
    }

    /**
     * @return Collection<int, RutaItem>
     */
    public function getRutaItems(): Collection
    {
        return $this->rutaItems;
    }

    public function addRutaItem(RutaItem $rutaItem): static
    {
        if (!$this->rutaItems->contains($rutaItem)) {
            $this->rutaItems->add($rutaItem);
            $rutaItem->setRuta($this);
        }

        return $this;
    }

    public function removeRutaItem(RutaItem $rutaItem): static
    {
        if ($this->rutaItems->removeElement($rutaItem)) {
            // set the owning side to null (unless already changed)
            if ($rutaItem->getRuta() === $this) {
                $rutaItem->setRuta(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Tour>
     */
    public function getTours(): Collection
    {
        return $this->tours;
    }

    public function addTour(Tour $tour): static
    {
        if (!$this->tours->contains($tour)) {
            $this->tours->add($tour);
            $tour->setRuta($this);
        }

        return $this;
    }

    public function removeTour(Tour $tour): static
    {
        if ($this->tours->removeElement($tour)) {
            // set the owning side to null (unless already changed)
            if ($tour->getRuta() === $this) {
                $tour->setRuta(null);
            }
        }

        return $this;
    }

    public function getLocalidad(): ?Localidad
    {
        return $this->Localidad;
    }

    public function setLocalidad(?Localidad $Localidad): static
    {
        $this->Localidad = $Localidad;

        return $this;
    }

    public function getPuntoInicio(): ?string
    {
        return $this->PuntoInicio;
    }

    public function setPuntoInicio(string $PuntoInicio): static
    {
        $this->PuntoInicio = $PuntoInicio;

        return $this;
    }
}
