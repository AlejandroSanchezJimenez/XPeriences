<?php

namespace App\Entity;

use App\Repository\ValoracionRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ValoracionRepository::class)]
class Valoracion
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'valoracions')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Tour $Tour = null;

    #[ORM\ManyToOne(inversedBy: 'valoracions')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Reserva $Reserva = null;

    #[ORM\Column]
    private ?int $Puntuacion = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTour(): ?Tour
    {
        return $this->Tour;
    }

    public function setTour(?Tour $Tour): static
    {
        $this->Tour = $Tour;

        return $this;
    }

    public function getReserva(): ?Reserva
    {
        return $this->Reserva;
    }

    public function setReserva(?Reserva $Reserva): static
    {
        $this->Reserva = $Reserva;

        return $this;
    }

    public function getPuntuacion(): ?int
    {
        return $this->Puntuacion;
    }

    public function setPuntuacion(int $Puntuacion): static
    {
        $this->Puntuacion = $Puntuacion;

        return $this;
    }
}
