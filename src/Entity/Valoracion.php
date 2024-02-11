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
    private ?Reserva $Reserva = null;

    #[ORM\Column]
    private ?int $Puntuacion = null;

    #[ORM\ManyToOne(inversedBy: 'valoracions')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Ruta $Ruta = null;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getRuta(): ?Ruta
    {
        return $this->Ruta;
    }

    public function setRuta(?Ruta $Ruta): static
    {
        $this->Ruta = $Ruta;

        return $this;
    }
}
