<?php

namespace App\Entity;

use App\Repository\ItemRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ItemRepository::class)]
class Item
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 50)]
    private ?string $Titulo = null;

    #[ORM\Column(length: 200)]
    private ?string $Descripcion = null;

    #[ORM\Column(type: Types::BLOB)]
    private $Foto = null;

    #[ORM\Column(length: 100)]
    private ?string $Geolocalizacion = null;

    #[ORM\OneToMany(mappedBy: 'Item', targetEntity: RutaItem::class, orphanRemoval: true)]
    private Collection $rutaItems;

    public function __construct()
    {
        $this->rutaItems = new ArrayCollection();
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

    public function getGeolocalizacion(): ?string
    {
        return $this->Geolocalizacion;
    }

    public function setGeolocalizacion(string $Geolocalizacion): static
    {
        $this->Geolocalizacion = $Geolocalizacion;

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
            $rutaItem->setItem($this);
        }

        return $this;
    }

    public function removeRutaItem(RutaItem $rutaItem): static
    {
        if ($this->rutaItems->removeElement($rutaItem)) {
            // set the owning side to null (unless already changed)
            if ($rutaItem->getItem() === $this) {
                $rutaItem->setItem(null);
            }
        }

        return $this;
    }
}
