<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200914061300 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'sqlite', 'Migration can only be executed safely on \'sqlite\'.');

        $this->addSql('DROP INDEX UNIQ_520431A1933FE08C');
        $this->addSql('CREATE TEMPORARY TABLE __temp__ingredient_stock AS SELECT id, ingredient_id, creation_date, quantity, price, state, ordered_date, received_date, ended_date FROM ingredient_stock');
        $this->addSql('DROP TABLE ingredient_stock');
        $this->addSql('CREATE TABLE ingredient_stock (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, ingredient_id INTEGER NOT NULL, creation_date DATETIME NOT NULL, quantity INTEGER NOT NULL, price INTEGER NOT NULL, state VARCHAR(10) NOT NULL COLLATE BINARY, ordered_date DATETIME DEFAULT NULL, received_date DATE DEFAULT NULL, ended_date DATE DEFAULT NULL, CONSTRAINT FK_520431A1933FE08C FOREIGN KEY (ingredient_id) REFERENCES ingredient (id) ON UPDATE NO ACTION ON DELETE NO ACTION NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('INSERT INTO ingredient_stock (id, ingredient_id, creation_date, quantity, price, state, ordered_date, received_date, ended_date) SELECT id, ingredient_id, creation_date, quantity, price, state, ordered_date, received_date, ended_date FROM __temp__ingredient_stock');
        $this->addSql('DROP TABLE __temp__ingredient_stock');
        $this->addSql('CREATE INDEX IDX_520431A1933FE08C ON ingredient_stock (ingredient_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'sqlite', 'Migration can only be executed safely on \'sqlite\'.');

        $this->addSql('DROP INDEX IDX_520431A1933FE08C');
        $this->addSql('CREATE TEMPORARY TABLE __temp__ingredient_stock AS SELECT id, ingredient_id, creation_date, quantity, price, state, ordered_date, received_date, ended_date FROM ingredient_stock');
        $this->addSql('DROP TABLE ingredient_stock');
        $this->addSql('CREATE TABLE ingredient_stock (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, ingredient_id INTEGER NOT NULL, creation_date DATETIME NOT NULL, quantity INTEGER NOT NULL, price INTEGER NOT NULL, state VARCHAR(10) NOT NULL, ordered_date DATETIME DEFAULT NULL, received_date DATE DEFAULT NULL, ended_date DATE DEFAULT NULL, CONSTRAINT FK_520431A1933FE08C FOREIGN KEY (ingredient_id) REFERENCES ingredient (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('INSERT INTO ingredient_stock (id, ingredient_id, creation_date, quantity, price, state, ordered_date, received_date, ended_date) SELECT id, ingredient_id, creation_date, quantity, price, state, ordered_date, received_date, ended_date FROM __temp__ingredient_stock');
        $this->addSql('DROP TABLE __temp__ingredient_stock');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_520431A1933FE08C ON ingredient_stock (ingredient_id)');
    }
}
