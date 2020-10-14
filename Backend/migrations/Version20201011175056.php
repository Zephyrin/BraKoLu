<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20201011175056 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'sqlite', 'Migration can only be executed safely on \'sqlite\'.');

        $this->addSql('DROP TABLE bottle_top');
        $this->addSql('DROP TABLE keg');
        $this->addSql('DROP TABLE yeast');
        $this->addSql('DROP INDEX UNIQ_6BAF78705E237E06');
        $this->addSql('CREATE TEMPORARY TABLE __temp__ingredient AS SELECT id, name, comment, unit, unit_factor, plant, format, ebc, childName, acid_alpha, harvest_year, type, volume, color, capacity, size, head, production_year FROM ingredient');
        $this->addSql('DROP TABLE ingredient');
        $this->addSql('CREATE TABLE ingredient (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, bottle_id INTEGER DEFAULT NULL, name VARCHAR(1024) NOT NULL COLLATE BINARY, comment VARCHAR(255) DEFAULT NULL COLLATE BINARY, unit VARCHAR(25) DEFAULT NULL COLLATE BINARY, unit_factor INTEGER NOT NULL, plant VARCHAR(255) DEFAULT NULL COLLATE BINARY, format VARCHAR(255) DEFAULT NULL COLLATE BINARY, ebc INTEGER DEFAULT NULL, childName VARCHAR(255) NOT NULL COLLATE BINARY, acid_alpha INTEGER DEFAULT NULL, harvest_year DATE DEFAULT NULL, type VARCHAR(30) DEFAULT NULL COLLATE BINARY, volume INTEGER DEFAULT NULL, color VARCHAR(30) DEFAULT NULL COLLATE BINARY, capacity INTEGER DEFAULT NULL, size INTEGER DEFAULT NULL, head VARCHAR(30) DEFAULT NULL COLLATE BINARY, production_year DATE DEFAULT NULL, CONSTRAINT FK_6BAF7870DCF9352B FOREIGN KEY (bottle_id) REFERENCES ingredient (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('INSERT INTO ingredient (id, name, comment, unit, unit_factor, plant, format, ebc, childName, acid_alpha, harvest_year, type, volume, color, capacity, size, head, production_year) SELECT id, name, comment, unit, unit_factor, plant, format, ebc, childName, acid_alpha, harvest_year, type, volume, color, capacity, size, head, production_year FROM __temp__ingredient');
        $this->addSql('DROP TABLE __temp__ingredient');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_6BAF78705E237E06 ON ingredient (name)');
        $this->addSql('CREATE INDEX IDX_6BAF7870DCF9352B ON ingredient (bottle_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'sqlite', 'Migration can only be executed safely on \'sqlite\'.');

        $this->addSql('CREATE TABLE yeast (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, type VARCHAR(30) NOT NULL COLLATE BINARY, production_year DATE NOT NULL)');
        $this->addSql('CREATE TABLE keg (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, volume INTEGER NOT NULL, head_type VARCHAR(30) NOT NULL COLLATE BINARY)');
        $this->addSql('CREATE TABLE bottle_top (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, size INTEGER NOT NULL, color VARCHAR(30) NOT NULL COLLATE BINARY)');
        $this->addSql('DROP INDEX UNIQ_6BAF78705E237E06');
        $this->addSql('DROP INDEX IDX_6BAF7870DCF9352B');
        $this->addSql('CREATE TEMPORARY TABLE __temp__ingredient AS SELECT id, name, comment, unit, unit_factor, childName, volume, type, color, size, capacity, plant, format, ebc, acid_alpha, harvest_year, head, production_year FROM ingredient');
        $this->addSql('DROP TABLE ingredient');
        $this->addSql('CREATE TABLE ingredient (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name VARCHAR(1024) NOT NULL, comment VARCHAR(255) DEFAULT NULL, unit VARCHAR(25) DEFAULT NULL, unit_factor INTEGER NOT NULL, childName VARCHAR(255) NOT NULL, volume INTEGER DEFAULT NULL, type VARCHAR(30) DEFAULT NULL, color VARCHAR(30) DEFAULT NULL, size INTEGER DEFAULT NULL, capacity INTEGER DEFAULT NULL, plant VARCHAR(255) DEFAULT NULL, format VARCHAR(255) DEFAULT NULL, ebc INTEGER DEFAULT NULL, acid_alpha INTEGER DEFAULT NULL, harvest_year DATE DEFAULT NULL, head VARCHAR(30) DEFAULT NULL, production_year DATE DEFAULT NULL)');
        $this->addSql('INSERT INTO ingredient (id, name, comment, unit, unit_factor, childName, volume, type, color, size, capacity, plant, format, ebc, acid_alpha, harvest_year, head, production_year) SELECT id, name, comment, unit, unit_factor, childName, volume, type, color, size, capacity, plant, format, ebc, acid_alpha, harvest_year, head, production_year FROM __temp__ingredient');
        $this->addSql('DROP TABLE __temp__ingredient');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_6BAF78705E237E06 ON ingredient (name)');
    }
}
