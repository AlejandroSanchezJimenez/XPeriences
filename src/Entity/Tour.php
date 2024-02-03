<?php

namespace App\Entity;

use App\Repository\TourRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TourRepository::class)]
class Tour
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'tours')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Ruta $Ruta = null;

    #[ORM\ManyToOne(inversedBy: 'tours')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $Guia = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $Fecha = null;

    #[ORM\Column(length: 50)]
    private ?string $Hora = null;

    #[ORM\OneToMany(mappedBy: 'Tour', targetEntity: Reserva::class, orphanRemoval: true)]
    private Collection $reservas;

    #[ORM\OneToMany(mappedBy: 'Tour', targetEntity: Valoracion::class, orphanRemoval: true)]
    private Collection $valoracions;

    #[ORM\OneToOne(mappedBy: 'Tour', cascade: ['persist', 'remove'])]
    private ?Informe $informe = null;

    public function __construct()
    {
        $this->reservas = new ArrayCollection();
        $this->valoracions = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getRuta(): ?Ruta
    {
        return $this->Ruta;
    }

    public function setRuta(?Ruta $Ruta): static
    {
        $this->Ruta = $Ruta;

        return $this;
    }

    public function getGuia(): ?User
    {
        return $this->Guia;
    }

    public function setGuia(?User $Guia): static
    {
        $this->Guia = $Guia;

        return $this;
    }

    public function getFecha(): ?\DateTimeInterface
    {
        return $this->Fecha;
    }

    public function setFecha(\DateTimeInterface $Fecha): static
    {
        $this->Fecha = $Fecha;

        return $this;
    }

    public function getHora(): ?string
    {
        return $this->Hora;
    }

    public function setHora(string $Hora): static
    {
        $this->Hora = $Hora;

        return $this;
    }

    /**
     * @return Collection<int, Reserva>
     */
    public function getReservas(): Collection
    {
        return $this->reservas;
    }

    public function addReserva(Reserva $reserva): static
    {
        if (!$this->reservas->contains($reserva)) {
            $this->reservas->add($reserva);
            $reserva->setTour($this);
        }

        return $this;
    }

    public function removeReserva(Reserva $reserva): static
    {
        if ($this->reservas->removeElement($reserva)) {
            // set the owning side to null (unless already changed)
            if ($reserva->getTour() === $this) {
                $reserva->setTour(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Valoracion>
     */
    public function getValoracions(): Collection
    {
        return $this->valoracions;
    }

    public function addValoracion(Valoracion $valoracion): static
    {
        if (!$this->valoracions->contains($valoracion)) {
            $this->valoracions->add($valoracion);
            $valoracion->setTour($this);
        }

        return $this;
    }

    public function removeValoracion(Valoracion $valoracion): static
    {
        if ($this->valoracions->removeElement($valoracion)) {
            // set the owning side to null (unless already changed)
            if ($valoracion->getTour() === $this) {
                $valoracion->setTour(null);
            }
        }

        return $this;
    }

    public function getInforme(): ?Informe
    {
        return $this->informe;
    }

    public function setInforme(Informe $informe): static
    {
        // set the owning side of the relation if necessary
        if ($informe->getTour() !== $this) {
            $informe->setTour($this);
        }

        $this->informe = $informe;

        return $this;
    }
}
