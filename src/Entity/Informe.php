<?php

namespace App\Entity;

use App\Repository\InformeRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: InformeRepository::class)]
class Informe
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\OneToOne(inversedBy: 'informe', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?Tour $Tour = null;

    #[ORM\Column(type: Types::BLOB)]
    private $fotoGrupo = null;

    #[ORM\Column(length: 200)]
    private ?string $Observaciones = null;

    #[ORM\Column]
    private ?int $dineroRuta = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTour(): ?Tour
    {
        return $this->Tour;
    }

    public function setTour(Tour $Tour): static
    {
        $this->Tour = $Tour;

        return $this;
    }

    public function getFotoGrupo()
    {
        return $this->fotoGrupo;
    }

    public function setFotoGrupo($fotoGrupo): static
    {
        $this->fotoGrupo = $fotoGrupo;

        return $this;
    }

    public function getObservaciones(): ?string
    {
        return $this->Observaciones;
    }

    public function setObservaciones(string $Observaciones): static
    {
        $this->Observaciones = $Observaciones;

        return $this;
    }

    public function getDineroRuta(): ?int
    {
        return $this->dineroRuta;
    }

    public function setDineroRuta(int $dineroRuta): static
    {
        $this->dineroRuta = $dineroRuta;

        return $this;
    }
}
