<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240208172730 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE ruta ADD CONSTRAINT FK_C3AEF08C67707C89 FOREIGN KEY (localidad_id) REFERENCES localidad (id)');
        $this->addSql('ALTER TABLE valoracion DROP FOREIGN KEY FK_6D3DE0F415ED8D43');
        $this->addSql('DROP INDEX IDX_6D3DE0F415ED8D43 ON valoracion');
        $this->addSql('ALTER TABLE valoracion CHANGE tour_id ruta_id INT NOT NULL');
        $this->addSql('ALTER TABLE valoracion ADD CONSTRAINT FK_6D3DE0F4ABBC4845 FOREIGN KEY (ruta_id) REFERENCES ruta (id)');
        $this->addSql('CREATE INDEX IDX_6D3DE0F4ABBC4845 ON valoracion (ruta_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE ruta DROP FOREIGN KEY FK_C3AEF08C67707C89');
        $this->addSql('ALTER TABLE valoracion DROP FOREIGN KEY FK_6D3DE0F4ABBC4845');
        $this->addSql('DROP INDEX IDX_6D3DE0F4ABBC4845 ON valoracion');
        $this->addSql('ALTER TABLE valoracion CHANGE ruta_id tour_id INT NOT NULL');
        $this->addSql('ALTER TABLE valoracion ADD CONSTRAINT FK_6D3DE0F415ED8D43 FOREIGN KEY (tour_id) REFERENCES tour (id)');
        $this->addSql('CREATE INDEX IDX_6D3DE0F415ED8D43 ON valoracion (tour_id)');
    }
}
