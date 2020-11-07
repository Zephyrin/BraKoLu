<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20201107161824 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'sqlite', 'Migration can only be executed safely on \'sqlite\'.');

        $this->addSql('CREATE TABLE brew (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name VARCHAR(255) NOT NULL, abv INTEGER NOT NULL, ibu INTEGER NOT NULL, ebc INTEGER NOT NULL, state VARCHAR(255) NOT NULL, produced_quantity INTEGER NOT NULL, started DATETIME DEFAULT NULL, ended DATETIME DEFAULT NULL, created DATETIME NOT NULL)');
        $this->addSql('DROP INDEX UNIQ_6BAF78705E237E06');
        $this->addSql('DROP INDEX IDX_6BAF7870DCF9352B');
        $this->addSql('CREATE TEMPORARY TABLE __temp__ingredient AS SELECT id, bottle_id, name, comment, unit, unit_factor, plant, format, ebc, childName, acid_alpha, harvest_year, type, volume, color, capacity, size, head, production_year FROM ingredient');
        $this->addSql('DROP TABLE ingredient');
        $this->addSql('CREATE TABLE ingredient (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, bottle_id INTEGER DEFAULT NULL, name VARCHAR(1024) NOT NULL COLLATE BINARY, comment VARCHAR(255) DEFAULT NULL COLLATE BINARY, unit VARCHAR(25) DEFAULT NULL COLLATE BINARY, unit_factor INTEGER NOT NULL, plant VARCHAR(255) DEFAULT NULL COLLATE BINARY, format VARCHAR(255) DEFAULT NULL COLLATE BINARY, ebc INTEGER DEFAULT NULL, childName VARCHAR(255) NOT NULL COLLATE BINARY, acid_alpha INTEGER DEFAULT NULL, harvest_year DATE DEFAULT NULL, type VARCHAR(30) DEFAULT NULL COLLATE BINARY, volume INTEGER DEFAULT NULL, color VARCHAR(30) DEFAULT NULL COLLATE BINARY, capacity INTEGER DEFAULT NULL, size INTEGER DEFAULT NULL, head VARCHAR(30) DEFAULT NULL COLLATE BINARY, production_year DATE DEFAULT NULL, CONSTRAINT FK_6BAF7870DCF9352B FOREIGN KEY (bottle_id) REFERENCES ingredient (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('INSERT INTO ingredient (id, bottle_id, name, comment, unit, unit_factor, plant, format, ebc, childName, acid_alpha, harvest_year, type, volume, color, capacity, size, head, production_year) SELECT id, bottle_id, name, comment, unit, unit_factor, plant, format, ebc, childName, acid_alpha, harvest_year, type, volume, color, capacity, size, head, production_year FROM __temp__ingredient');
        $this->addSql('DROP TABLE __temp__ingredient');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_6BAF78705E237E06 ON ingredient (name)');
        $this->addSql('CREATE INDEX IDX_6BAF7870DCF9352B ON ingredient (bottle_id)');
        $this->addSql('DROP INDEX IDX_520431A1933FE08C');
        $this->addSql('CREATE TEMPORARY TABLE __temp__ingredient_stock AS SELECT id, ingredient_id, quantity, price, state, received_date, ended_date, creation_date, ordered_date FROM ingredient_stock');
        $this->addSql('DROP TABLE ingredient_stock');
        $this->addSql('CREATE TABLE ingredient_stock (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, ingredient_id INTEGER NOT NULL, quantity INTEGER NOT NULL, price INTEGER NOT NULL, state VARCHAR(10) NOT NULL COLLATE BINARY, received_date DATE DEFAULT NULL, ended_date DATE DEFAULT NULL, creation_date DATE NOT NULL, ordered_date DATE DEFAULT NULL, CONSTRAINT FK_520431A1933FE08C FOREIGN KEY (ingredient_id) REFERENCES ingredient (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('INSERT INTO ingredient_stock (id, ingredient_id, quantity, price, state, received_date, ended_date, creation_date, ordered_date) SELECT id, ingredient_id, quantity, price, state, received_date, ended_date, creation_date, ordered_date FROM __temp__ingredient_stock');
        $this->addSql('DROP TABLE __temp__ingredient_stock');
        $this->addSql('CREATE INDEX IDX_520431A1933FE08C ON ingredient_stock (ingredient_id)');
        $this->addSql('DROP INDEX IDX_BA5B61BD2ADD6D8C');
        $this->addSql('DROP INDEX IDX_BA5B61BD7FCB319E');
        $this->addSql('CREATE TEMPORARY TABLE __temp__ingredient_stock_supplier AS SELECT ingredient_stock_id, supplier_id FROM ingredient_stock_supplier');
        $this->addSql('DROP TABLE ingredient_stock_supplier');
        $this->addSql('CREATE TABLE ingredient_stock_supplier (ingredient_stock_id INTEGER NOT NULL, supplier_id INTEGER NOT NULL, PRIMARY KEY(ingredient_stock_id, supplier_id), CONSTRAINT FK_BA5B61BD7FCB319E FOREIGN KEY (ingredient_stock_id) REFERENCES ingredient_stock (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE, CONSTRAINT FK_BA5B61BD2ADD6D8C FOREIGN KEY (supplier_id) REFERENCES supplier (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('INSERT INTO ingredient_stock_supplier (ingredient_stock_id, supplier_id) SELECT ingredient_stock_id, supplier_id FROM __temp__ingredient_stock_supplier');
        $this->addSql('DROP TABLE __temp__ingredient_stock_supplier');
        $this->addSql('CREATE INDEX IDX_BA5B61BD2ADD6D8C ON ingredient_stock_supplier (supplier_id)');
        $this->addSql('CREATE INDEX IDX_BA5B61BD7FCB319E ON ingredient_stock_supplier (ingredient_stock_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'sqlite', 'Migration can only be executed safely on \'sqlite\'.');

        $this->addSql('DROP TABLE brew');
        $this->addSql('DROP INDEX UNIQ_6BAF78705E237E06');
        $this->addSql('DROP INDEX IDX_6BAF7870DCF9352B');
        $this->addSql('CREATE TEMPORARY TABLE __temp__ingredient AS SELECT id, bottle_id, name, comment, unit, unit_factor, childName, volume, type, color, size, capacity, plant, format, ebc, acid_alpha, harvest_year, head, production_year FROM ingredient');
        $this->addSql('DROP TABLE ingredient');
        $this->addSql('CREATE TABLE ingredient (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, bottle_id INTEGER DEFAULT NULL, name VARCHAR(1024) NOT NULL, comment VARCHAR(255) DEFAULT NULL, unit VARCHAR(25) DEFAULT NULL, unit_factor INTEGER NOT NULL, childName VARCHAR(255) NOT NULL, volume INTEGER DEFAULT NULL, type VARCHAR(30) DEFAULT NULL, color VARCHAR(30) DEFAULT NULL, size INTEGER DEFAULT NULL, capacity INTEGER DEFAULT NULL, plant VARCHAR(255) DEFAULT NULL, format VARCHAR(255) DEFAULT NULL, ebc INTEGER DEFAULT NULL, acid_alpha INTEGER DEFAULT NULL, harvest_year DATE DEFAULT NULL, head VARCHAR(30) DEFAULT NULL, production_year DATE DEFAULT NULL)');
        $this->addSql('INSERT INTO ingredient (id, bottle_id, name, comment, unit, unit_factor, childName, volume, type, color, size, capacity, plant, format, ebc, acid_alpha, harvest_year, head, production_year) SELECT id, bottle_id, name, comment, unit, unit_factor, childName, volume, type, color, size, capacity, plant, format, ebc, acid_alpha, harvest_year, head, production_year FROM __temp__ingredient');
        $this->addSql('DROP TABLE __temp__ingredient');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_6BAF78705E237E06 ON ingredient (name)');
        $this->addSql('CREATE INDEX IDX_6BAF7870DCF9352B ON ingredient (bottle_id)');
        $this->addSql('DROP INDEX IDX_520431A1933FE08C');
        $this->addSql('CREATE TEMPORARY TABLE __temp__ingredient_stock AS SELECT id, ingredient_id, creation_date, quantity, price, state, ordered_date, received_date, ended_date FROM ingredient_stock');
        $this->addSql('DROP TABLE ingredient_stock');
        $this->addSql('CREATE TABLE ingredient_stock (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, ingredient_id INTEGER NOT NULL, creation_date DATE NOT NULL, quantity INTEGER NOT NULL, price INTEGER NOT NULL, state VARCHAR(10) NOT NULL, ordered_date DATE DEFAULT NULL, received_date DATE DEFAULT NULL, ended_date DATE DEFAULT NULL)');
        $this->addSql('INSERT INTO ingredient_stock (id, ingredient_id, creation_date, quantity, price, state, ordered_date, received_date, ended_date) SELECT id, ingredient_id, creation_date, quantity, price, state, ordered_date, received_date, ended_date FROM __temp__ingredient_stock');
        $this->addSql('DROP TABLE __temp__ingredient_stock');
        $this->addSql('CREATE INDEX IDX_520431A1933FE08C ON ingredient_stock (ingredient_id)');
        $this->addSql('DROP INDEX IDX_BA5B61BD7FCB319E');
        $this->addSql('DROP INDEX IDX_BA5B61BD2ADD6D8C');
        $this->addSql('CREATE TEMPORARY TABLE __temp__ingredient_stock_supplier AS SELECT ingredient_stock_id, supplier_id FROM ingredient_stock_supplier');
        $this->addSql('DROP TABLE ingredient_stock_supplier');
        $this->addSql('CREATE TABLE ingredient_stock_supplier (ingredient_stock_id INTEGER NOT NULL, supplier_id INTEGER NOT NULL, PRIMARY KEY(ingredient_stock_id, supplier_id))');
        $this->addSql('INSERT INTO ingredient_stock_supplier (ingredient_stock_id, supplier_id) SELECT ingredient_stock_id, supplier_id FROM __temp__ingredient_stock_supplier');
        $this->addSql('DROP TABLE __temp__ingredient_stock_supplier');
        $this->addSql('CREATE INDEX IDX_BA5B61BD7FCB319E ON ingredient_stock_supplier (ingredient_stock_id)');
        $this->addSql('CREATE INDEX IDX_BA5B61BD2ADD6D8C ON ingredient_stock_supplier (supplier_id)');
    }
}
