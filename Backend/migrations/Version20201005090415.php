<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20201005090415 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'sqlite', 'Migration can only be executed safely on \'sqlite\'.');

        $this->addSql('CREATE TABLE yeast (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, type VARCHAR(30) NOT NULL, production_year DATE NOT NULL)');
        $this->addSql('CREATE TABLE bottle_top (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, size INTEGER NOT NULL, color VARCHAR(30) NOT NULL)');
        $this->addSql('CREATE TABLE keg (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, volume INTEGER NOT NULL, head_type VARCHAR(30) NOT NULL)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'sqlite', 'Migration can only be executed safely on \'sqlite\'.');

        $this->addSql('DROP TABLE keg');
        $this->addSql('DROP TABLE bottle_top');
        $this->addSql('DROP TABLE yeast');
        $this->addSql('DROP INDEX UNIQ_6BAF78705E237E06');
        $this->addSql('CREATE TEMPORARY TABLE __temp__ingredient AS SELECT id, name, comment, unit, unit_factor, childName, plant, type, format, ebc, acid_alpha, harvest_year, volume, color, capacity FROM ingredient');
        $this->addSql('DROP TABLE ingredient');
        $this->addSql('CREATE TABLE ingredient (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name VARCHAR(1024) NOT NULL, comment VARCHAR(255) DEFAULT NULL, unit VARCHAR(25) DEFAULT NULL, unit_factor INTEGER NOT NULL, childName VARCHAR(255) NOT NULL, plant VARCHAR(255) DEFAULT NULL, type VARCHAR(30) DEFAULT NULL, format VARCHAR(255) DEFAULT NULL, ebc INTEGER DEFAULT NULL, acid_alpha INTEGER DEFAULT NULL, harvest_year DATE DEFAULT NULL, volume INTEGER DEFAULT NULL, color VARCHAR(30) DEFAULT NULL, capacity INTEGER DEFAULT NULL)');
        $this->addSql('INSERT INTO ingredient (id, name, comment, unit, unit_factor, childName, plant, type, format, ebc, acid_alpha, harvest_year, volume, color, capacity) SELECT id, name, comment, unit, unit_factor, childName, plant, type, format, ebc, acid_alpha, harvest_year, volume, color, capacity FROM __temp__ingredient');
        $this->addSql('DROP TABLE __temp__ingredient');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_6BAF78705E237E06 ON ingredient (name)');
    }
}
