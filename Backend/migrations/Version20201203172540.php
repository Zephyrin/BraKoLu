<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20201203172540 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'sqlite', 'Migration can only be executed safely on \'sqlite\'.');

        $this->addSql('DROP TABLE stock_not_order');
        $this->addSql('DROP INDEX IDX_6BAF7870DCF9352B');
        $this->addSql('DROP INDEX UNIQ_6BAF78705E237E06');
        $this->addSql('CREATE TEMPORARY TABLE __temp__ingredient AS SELECT id, bottle_id, name, comment, unit, unit_factor, childName, volume, type, color, size, capacity, plant, category, format, ebc, acid_alpha, harvest_year, head, production_year FROM ingredient');
        $this->addSql('DROP TABLE ingredient');
        $this->addSql('CREATE TABLE ingredient (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, bottle_id INTEGER DEFAULT NULL, name VARCHAR(1024) NOT NULL COLLATE BINARY, comment VARCHAR(255) DEFAULT NULL COLLATE BINARY, unit VARCHAR(25) DEFAULT NULL COLLATE BINARY, unit_factor INTEGER NOT NULL, childName VARCHAR(255) NOT NULL COLLATE BINARY, volume INTEGER DEFAULT NULL, type VARCHAR(30) DEFAULT NULL COLLATE BINARY, color VARCHAR(30) DEFAULT NULL COLLATE BINARY, size INTEGER DEFAULT NULL, capacity INTEGER DEFAULT NULL, plant VARCHAR(255) DEFAULT NULL COLLATE BINARY, category VARCHAR(255) DEFAULT NULL COLLATE BINARY, format VARCHAR(255) DEFAULT NULL COLLATE BINARY, ebc INTEGER DEFAULT NULL, acid_alpha INTEGER DEFAULT NULL, harvest_year DATE DEFAULT NULL, head VARCHAR(30) DEFAULT NULL COLLATE BINARY, production_year DATE DEFAULT NULL, CONSTRAINT FK_6BAF7870DCF9352B FOREIGN KEY (bottle_id) REFERENCES ingredient (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('INSERT INTO ingredient (id, bottle_id, name, comment, unit, unit_factor, childName, volume, type, color, size, capacity, plant, category, format, ebc, acid_alpha, harvest_year, head, production_year) SELECT id, bottle_id, name, comment, unit, unit_factor, childName, volume, type, color, size, capacity, plant, category, format, ebc, acid_alpha, harvest_year, head, production_year FROM __temp__ingredient');
        $this->addSql('DROP TABLE __temp__ingredient');
        $this->addSql('CREATE INDEX IDX_6BAF7870DCF9352B ON ingredient (bottle_id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_6BAF78705E237E06 ON ingredient (name)');
        $this->addSql('DROP INDEX IDX_29C50C4DDCD6110');
        $this->addSql('DROP INDEX IDX_29C50C4DF9955242');
        $this->addSql('CREATE TEMPORARY TABLE __temp__brew_stock AS SELECT id, brew_id, stock_id, quantity, apply FROM brew_stock');
        $this->addSql('DROP TABLE brew_stock');
        $this->addSql('CREATE TABLE brew_stock (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, brew_id INTEGER NOT NULL, stock_id INTEGER NOT NULL, quantity INTEGER NOT NULL, apply BOOLEAN NOT NULL, CONSTRAINT FK_29C50C4DF9955242 FOREIGN KEY (brew_id) REFERENCES brew (id) NOT DEFERRABLE INITIALLY IMMEDIATE, CONSTRAINT FK_29C50C4DDCD6110 FOREIGN KEY (stock_id) REFERENCES ingredient_stock (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('INSERT INTO brew_stock (id, brew_id, stock_id, quantity, apply) SELECT id, brew_id, stock_id, quantity, apply FROM __temp__brew_stock');
        $this->addSql('DROP TABLE __temp__brew_stock');
        $this->addSql('CREATE INDEX IDX_29C50C4DDCD6110 ON brew_stock (stock_id)');
        $this->addSql('CREATE INDEX IDX_29C50C4DF9955242 ON brew_stock (brew_id)');
        $this->addSql('DROP INDEX IDX_1607B8AF933FE08C');
        $this->addSql('DROP INDEX IDX_1607B8AFF9955242');
        $this->addSql('CREATE TEMPORARY TABLE __temp__brew_ingredient AS SELECT id, brew_id, ingredient_id, quantity FROM brew_ingredient');
        $this->addSql('DROP TABLE brew_ingredient');
        $this->addSql('CREATE TABLE brew_ingredient (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, brew_id INTEGER NOT NULL, ingredient_id INTEGER NOT NULL, quantity INTEGER NOT NULL, CONSTRAINT FK_1607B8AFF9955242 FOREIGN KEY (brew_id) REFERENCES brew (id) NOT DEFERRABLE INITIALLY IMMEDIATE, CONSTRAINT FK_1607B8AF933FE08C FOREIGN KEY (ingredient_id) REFERENCES ingredient (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('INSERT INTO brew_ingredient (id, brew_id, ingredient_id, quantity) SELECT id, brew_id, ingredient_id, quantity FROM __temp__brew_ingredient');
        $this->addSql('DROP TABLE __temp__brew_ingredient');
        $this->addSql('CREATE INDEX IDX_1607B8AF933FE08C ON brew_ingredient (ingredient_id)');
        $this->addSql('CREATE INDEX IDX_1607B8AFF9955242 ON brew_ingredient (brew_id)');
        $this->addSql('DROP INDEX IDX_7E0BF4879395C3F3');
        $this->addSql('CREATE TEMPORARY TABLE __temp__order_quantity AS SELECT id, customer_id, quantity, order_date, gift_bottle_quantity, sell_bottle_quantity, gift_keg_quantity, sell_keg_quantity FROM order_quantity');
        $this->addSql('DROP TABLE order_quantity');
        $this->addSql('CREATE TABLE order_quantity (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, customer_id INTEGER DEFAULT NULL, quantity INTEGER NOT NULL, order_date DATETIME NOT NULL, gift_bottle_quantity INTEGER DEFAULT NULL, sell_bottle_quantity INTEGER DEFAULT NULL, gift_keg_quantity INTEGER DEFAULT NULL, sell_keg_quantity INTEGER DEFAULT NULL, CONSTRAINT FK_7E0BF4879395C3F3 FOREIGN KEY (customer_id) REFERENCES customer (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('INSERT INTO order_quantity (id, customer_id, quantity, order_date, gift_bottle_quantity, sell_bottle_quantity, gift_keg_quantity, sell_keg_quantity) SELECT id, customer_id, quantity, order_date, gift_bottle_quantity, sell_bottle_quantity, gift_keg_quantity, sell_keg_quantity FROM __temp__order_quantity');
        $this->addSql('DROP TABLE __temp__order_quantity');
        $this->addSql('CREATE INDEX IDX_7E0BF4879395C3F3 ON order_quantity (customer_id)');
        $this->addSql('DROP INDEX IDX_520431A12ADD6D8C');
        $this->addSql('DROP INDEX IDX_520431A1AA60395A');
        $this->addSql('DROP INDEX IDX_520431A1933FE08C');
        $this->addSql('CREATE TEMPORARY TABLE __temp__ingredient_stock AS SELECT id, ingredient_id, ordered_id, supplier_id, creation_date, quantity, price, state, ordered_date, received_date, ended_date FROM ingredient_stock');
        $this->addSql('DROP TABLE ingredient_stock');
        $this->addSql('CREATE TABLE ingredient_stock (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, ingredient_id INTEGER NOT NULL, ordered_id INTEGER DEFAULT NULL, supplier_id INTEGER DEFAULT NULL, creation_date DATE NOT NULL, quantity INTEGER DEFAULT NULL, price INTEGER DEFAULT NULL, state VARCHAR(10) NOT NULL COLLATE BINARY, ordered_date DATE DEFAULT NULL, received_date DATE DEFAULT NULL, ended_date DATE DEFAULT NULL, CONSTRAINT FK_520431A1933FE08C FOREIGN KEY (ingredient_id) REFERENCES ingredient (id) NOT DEFERRABLE INITIALLY IMMEDIATE, CONSTRAINT FK_520431A1AA60395A FOREIGN KEY (ordered_id) REFERENCES "order" (id) NOT DEFERRABLE INITIALLY IMMEDIATE, CONSTRAINT FK_520431A12ADD6D8C FOREIGN KEY (supplier_id) REFERENCES supplier (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('INSERT INTO ingredient_stock (id, ingredient_id, ordered_id, supplier_id, creation_date, quantity, price, state, ordered_date, received_date, ended_date) SELECT id, ingredient_id, ordered_id, supplier_id, creation_date, quantity, price, state, ordered_date, received_date, ended_date FROM __temp__ingredient_stock');
        $this->addSql('DROP TABLE __temp__ingredient_stock');
        $this->addSql('CREATE INDEX IDX_520431A12ADD6D8C ON ingredient_stock (supplier_id)');
        $this->addSql('CREATE INDEX IDX_520431A1AA60395A ON ingredient_stock (ordered_id)');
        $this->addSql('CREATE INDEX IDX_520431A1933FE08C ON ingredient_stock (ingredient_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'sqlite', 'Migration can only be executed safely on \'sqlite\'.');

        $this->addSql('CREATE TABLE stock_not_order (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, ordered_id INTEGER NOT NULL, brew_stock_id INTEGER NOT NULL)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_350A30F859B8A2B9 ON stock_not_order (brew_stock_id)');
        $this->addSql('CREATE INDEX IDX_350A30F8AA60395A ON stock_not_order (ordered_id)');
        $this->addSql('DROP INDEX IDX_1607B8AFF9955242');
        $this->addSql('DROP INDEX IDX_1607B8AF933FE08C');
        $this->addSql('CREATE TEMPORARY TABLE __temp__brew_ingredient AS SELECT id, brew_id, ingredient_id, quantity FROM brew_ingredient');
        $this->addSql('DROP TABLE brew_ingredient');
        $this->addSql('CREATE TABLE brew_ingredient (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, brew_id INTEGER NOT NULL, ingredient_id INTEGER NOT NULL, quantity INTEGER NOT NULL)');
        $this->addSql('INSERT INTO brew_ingredient (id, brew_id, ingredient_id, quantity) SELECT id, brew_id, ingredient_id, quantity FROM __temp__brew_ingredient');
        $this->addSql('DROP TABLE __temp__brew_ingredient');
        $this->addSql('CREATE INDEX IDX_1607B8AFF9955242 ON brew_ingredient (brew_id)');
        $this->addSql('CREATE INDEX IDX_1607B8AF933FE08C ON brew_ingredient (ingredient_id)');
        $this->addSql('DROP INDEX IDX_29C50C4DF9955242');
        $this->addSql('DROP INDEX IDX_29C50C4DDCD6110');
        $this->addSql('CREATE TEMPORARY TABLE __temp__brew_stock AS SELECT id, brew_id, stock_id, quantity, apply FROM brew_stock');
        $this->addSql('DROP TABLE brew_stock');
        $this->addSql('CREATE TABLE brew_stock (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, brew_id INTEGER NOT NULL, stock_id INTEGER NOT NULL, quantity INTEGER NOT NULL, apply BOOLEAN NOT NULL)');
        $this->addSql('INSERT INTO brew_stock (id, brew_id, stock_id, quantity, apply) SELECT id, brew_id, stock_id, quantity, apply FROM __temp__brew_stock');
        $this->addSql('DROP TABLE __temp__brew_stock');
        $this->addSql('CREATE INDEX IDX_29C50C4DF9955242 ON brew_stock (brew_id)');
        $this->addSql('CREATE INDEX IDX_29C50C4DDCD6110 ON brew_stock (stock_id)');
        $this->addSql('DROP INDEX UNIQ_6BAF78705E237E06');
        $this->addSql('DROP INDEX IDX_6BAF7870DCF9352B');
        $this->addSql('CREATE TEMPORARY TABLE __temp__ingredient AS SELECT id, bottle_id, name, comment, unit, unit_factor, childName, volume, type, color, size, capacity, plant, category, format, ebc, acid_alpha, harvest_year, head, production_year FROM ingredient');
        $this->addSql('DROP TABLE ingredient');
        $this->addSql('CREATE TABLE ingredient (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, bottle_id INTEGER DEFAULT NULL, name VARCHAR(1024) NOT NULL, comment VARCHAR(255) DEFAULT NULL, unit VARCHAR(25) DEFAULT NULL, unit_factor INTEGER NOT NULL, childName VARCHAR(255) NOT NULL, volume INTEGER DEFAULT NULL, type VARCHAR(30) DEFAULT NULL, color VARCHAR(30) DEFAULT NULL, size INTEGER DEFAULT NULL, capacity INTEGER DEFAULT NULL, plant VARCHAR(255) DEFAULT NULL, category VARCHAR(255) DEFAULT NULL, format VARCHAR(255) DEFAULT NULL, ebc INTEGER DEFAULT NULL, acid_alpha INTEGER DEFAULT NULL, harvest_year DATE DEFAULT NULL, head VARCHAR(30) DEFAULT NULL, production_year DATE DEFAULT NULL)');
        $this->addSql('INSERT INTO ingredient (id, bottle_id, name, comment, unit, unit_factor, childName, volume, type, color, size, capacity, plant, category, format, ebc, acid_alpha, harvest_year, head, production_year) SELECT id, bottle_id, name, comment, unit, unit_factor, childName, volume, type, color, size, capacity, plant, category, format, ebc, acid_alpha, harvest_year, head, production_year FROM __temp__ingredient');
        $this->addSql('DROP TABLE __temp__ingredient');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_6BAF78705E237E06 ON ingredient (name)');
        $this->addSql('CREATE INDEX IDX_6BAF7870DCF9352B ON ingredient (bottle_id)');
        $this->addSql('DROP INDEX IDX_520431A1933FE08C');
        $this->addSql('DROP INDEX IDX_520431A1AA60395A');
        $this->addSql('DROP INDEX IDX_520431A12ADD6D8C');
        $this->addSql('CREATE TEMPORARY TABLE __temp__ingredient_stock AS SELECT id, ingredient_id, ordered_id, supplier_id, creation_date, quantity, price, state, ordered_date, received_date, ended_date FROM ingredient_stock');
        $this->addSql('DROP TABLE ingredient_stock');
        $this->addSql('CREATE TABLE ingredient_stock (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, ingredient_id INTEGER NOT NULL, ordered_id INTEGER DEFAULT NULL, supplier_id INTEGER DEFAULT NULL, creation_date DATE NOT NULL, quantity INTEGER DEFAULT NULL, price INTEGER DEFAULT NULL, state VARCHAR(10) NOT NULL, ordered_date DATE DEFAULT NULL, received_date DATE DEFAULT NULL, ended_date DATE DEFAULT NULL)');
        $this->addSql('INSERT INTO ingredient_stock (id, ingredient_id, ordered_id, supplier_id, creation_date, quantity, price, state, ordered_date, received_date, ended_date) SELECT id, ingredient_id, ordered_id, supplier_id, creation_date, quantity, price, state, ordered_date, received_date, ended_date FROM __temp__ingredient_stock');
        $this->addSql('DROP TABLE __temp__ingredient_stock');
        $this->addSql('CREATE INDEX IDX_520431A1933FE08C ON ingredient_stock (ingredient_id)');
        $this->addSql('CREATE INDEX IDX_520431A1AA60395A ON ingredient_stock (ordered_id)');
        $this->addSql('CREATE INDEX IDX_520431A12ADD6D8C ON ingredient_stock (supplier_id)');
        $this->addSql('DROP INDEX IDX_7E0BF4879395C3F3');
        $this->addSql('CREATE TEMPORARY TABLE __temp__order_quantity AS SELECT id, customer_id, quantity, order_date, gift_bottle_quantity, sell_bottle_quantity, gift_keg_quantity, sell_keg_quantity FROM order_quantity');
        $this->addSql('DROP TABLE order_quantity');
        $this->addSql('CREATE TABLE order_quantity (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, customer_id INTEGER DEFAULT NULL, quantity INTEGER NOT NULL, order_date DATETIME NOT NULL, gift_bottle_quantity INTEGER DEFAULT NULL, sell_bottle_quantity INTEGER DEFAULT NULL, gift_keg_quantity INTEGER DEFAULT NULL, sell_keg_quantity INTEGER DEFAULT NULL)');
        $this->addSql('INSERT INTO order_quantity (id, customer_id, quantity, order_date, gift_bottle_quantity, sell_bottle_quantity, gift_keg_quantity, sell_keg_quantity) SELECT id, customer_id, quantity, order_date, gift_bottle_quantity, sell_bottle_quantity, gift_keg_quantity, sell_keg_quantity FROM __temp__order_quantity');
        $this->addSql('DROP TABLE __temp__order_quantity');
        $this->addSql('CREATE INDEX IDX_7E0BF4879395C3F3 ON order_quantity (customer_id)');
    }
}
