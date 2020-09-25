<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200923214854 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'sqlite', 'Migration can only be executed safely on \'sqlite\'.');

        $this->addSql('DROP INDEX UNIQ_6BAF78705E237E06');
        $this->addSql('CREATE TEMPORARY TABLE __temp__ingredient AS SELECT id, name, comment, unit, unit_factor, plant, type, format, ebc, childName FROM ingredient');
        $this->addSql('DROP TABLE ingredient');
        $this->addSql('CREATE TABLE ingredient (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name VARCHAR(1024) NOT NULL COLLATE BINARY, comment VARCHAR(255) DEFAULT NULL COLLATE BINARY, unit VARCHAR(25) DEFAULT NULL COLLATE BINARY, unit_factor INTEGER NOT NULL, plant VARCHAR(255) DEFAULT NULL COLLATE BINARY, format VARCHAR(255) DEFAULT NULL COLLATE BINARY, ebc INTEGER DEFAULT NULL, childName VARCHAR(255) NOT NULL COLLATE BINARY, type VARCHAR(25) DEFAULT NULL, acid_alpha INTEGER DEFAULT NULL, harvest_year DATE DEFAULT NULL)');
        $this->addSql('INSERT INTO ingredient (id, name, comment, unit, unit_factor, plant, type, format, ebc, childName) SELECT id, name, comment, unit, unit_factor, plant, type, format, ebc, childName FROM __temp__ingredient');
        $this->addSql('DROP TABLE __temp__ingredient');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_6BAF78705E237E06 ON ingredient (name)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'sqlite', 'Migration can only be executed safely on \'sqlite\'.');

        $this->addSql('DROP INDEX UNIQ_6BAF78705E237E06');
        $this->addSql('CREATE TEMPORARY TABLE __temp__ingredient AS SELECT id, name, comment, unit, unit_factor, childName, plant, type, format, ebc FROM ingredient');
        $this->addSql('DROP TABLE ingredient');
        $this->addSql('CREATE TABLE ingredient (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name VARCHAR(1024) NOT NULL, comment VARCHAR(255) DEFAULT NULL, unit VARCHAR(25) DEFAULT NULL, unit_factor INTEGER NOT NULL, childName VARCHAR(255) NOT NULL, plant VARCHAR(255) DEFAULT NULL, format VARCHAR(255) DEFAULT NULL, ebc INTEGER DEFAULT NULL, type VARCHAR(512) DEFAULT NULL COLLATE BINARY)');
        $this->addSql('INSERT INTO ingredient (id, name, comment, unit, unit_factor, childName, plant, type, format, ebc) SELECT id, name, comment, unit, unit_factor, childName, plant, type, format, ebc FROM __temp__ingredient');
        $this->addSql('DROP TABLE __temp__ingredient');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_6BAF78705E237E06 ON ingredient (name)');
    }
}
