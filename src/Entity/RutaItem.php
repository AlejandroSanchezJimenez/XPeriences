<?php

namespace App\Entity;

use App\Repository\RutaItemRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: RutaItemRepository::class)]
class RutaItem
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'rutaItems')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Ruta $Ruta = null;

    #[ORM\ManyToOne(inversedBy: 'rutaItems')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Item $Item = null;

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

    public function getItem(): ?Item
    {
        return $this->Item;
    }

    public function setItem(?Item $Item): static
    {
        $this->Item = $Item;

        return $this;
    }
}
