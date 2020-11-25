<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20201121170447 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'sqlite', 'Migration can only be executed safely on \'sqlite\'.');

        $this->addSql('CREATE TABLE ingredient (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, bottle_id INTEGER DEFAULT NULL, name VARCHAR(1024) NOT NULL, comment VARCHAR(255) DEFAULT NULL, unit VARCHAR(25) DEFAULT NULL, unit_factor INTEGER NOT NULL, childName VARCHAR(255) NOT NULL, volume INTEGER DEFAULT NULL, type VARCHAR(30) DEFAULT NULL, color VARCHAR(30) DEFAULT NULL, size INTEGER DEFAULT NULL, capacity INTEGER DEFAULT NULL, plant VARCHAR(255) DEFAULT NULL, category VARCHAR(255) DEFAULT NULL, format VARCHAR(255) DEFAULT NULL, ebc INTEGER DEFAULT NULL, acid_alpha INTEGER DEFAULT NULL, harvest_year DATE DEFAULT NULL, head VARCHAR(30) DEFAULT NULL, production_year DATE DEFAULT NULL)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_6BAF78705E237E06 ON ingredient (name)');
        $this->addSql('CREATE INDEX IDX_6BAF7870DCF9352B ON ingredient (bottle_id)');
        $this->addSql('CREATE TABLE brew_stock (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, brew_id INTEGER NOT NULL, stock_id INTEGER NOT NULL, quantity INTEGER NOT NULL, apply BOOLEAN NOT NULL)');
        $this->addSql('CREATE INDEX IDX_29C50C4DF9955242 ON brew_stock (brew_id)');
        $this->addSql('CREATE INDEX IDX_29C50C4DDCD6110 ON brew_stock (stock_id)');
        $this->addSql('CREATE TABLE brew_ingredient (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, brew_id INTEGER NOT NULL, ingredient_id INTEGER NOT NULL, quantity INTEGER NOT NULL)');
        $this->addSql('CREATE INDEX IDX_1607B8AFF9955242 ON brew_ingredient (brew_id)');
        $this->addSql('CREATE INDEX IDX_1607B8AF933FE08C ON brew_ingredient (ingredient_id)');
        $this->addSql('CREATE TABLE supplier (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name VARCHAR(255) NOT NULL)');
        $this->addSql('CREATE TABLE order_quantity (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, customer_id INTEGER DEFAULT NULL, quantity INTEGER NOT NULL, order_date DATETIME NOT NULL, gift_bottle_quantity INTEGER DEFAULT NULL, sell_bottle_quantity INTEGER DEFAULT NULL, gift_keg_quantity INTEGER DEFAULT NULL, sell_keg_quantity INTEGER DEFAULT NULL)');
        $this->addSql('CREATE INDEX IDX_7E0BF4879395C3F3 ON order_quantity (customer_id)');
        $this->addSql('CREATE TABLE "order" (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, created DATETIME NOT NULL, state VARCHAR(30) NOT NULL)');
        $this->addSql('CREATE TABLE stock_not_order (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, ordered_id INTEGER NOT NULL, brew_stock_id INTEGER NOT NULL)');
        $this->addSql('CREATE INDEX IDX_350A30F8AA60395A ON stock_not_order (ordered_id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_350A30F859B8A2B9 ON stock_not_order (brew_stock_id)');
        $this->addSql('CREATE TABLE ingredient_stock (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, ingredient_id INTEGER NOT NULL, ordered_id INTEGER DEFAULT NULL, supplier_id INTEGER DEFAULT NULL, creation_date DATE NOT NULL, quantity INTEGER DEFAULT NULL, price INTEGER DEFAULT NULL, state VARCHAR(10) NOT NULL, ordered_date DATE DEFAULT NULL, received_date DATE DEFAULT NULL, ended_date DATE DEFAULT NULL)');
        $this->addSql('CREATE INDEX IDX_520431A1933FE08C ON ingredient_stock (ingredient_id)');
        $this->addSql('CREATE INDEX IDX_520431A1AA60395A ON ingredient_stock (ordered_id)');
        $this->addSql('CREATE INDEX IDX_520431A12ADD6D8C ON ingredient_stock (supplier_id)');
        $this->addSql('CREATE TABLE customer (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name VARCHAR(255) NOT NULL, deposit INTEGER DEFAULT NULL, keg_deposit INTEGER DEFAULT NULL)');
        $this->addSql('CREATE TABLE brew (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name VARCHAR(255) NOT NULL, abv INTEGER NOT NULL, ibu INTEGER NOT NULL, ebc INTEGER NOT NULL, state VARCHAR(255) NOT NULL, produced_quantity INTEGER DEFAULT NULL, started DATETIME DEFAULT NULL, ended DATETIME DEFAULT NULL, created DATETIME NOT NULL, number VARCHAR(15) NOT NULL)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'sqlite', 'Migration can only be executed safely on \'sqlite\'.');

        $this->addSql('DROP TABLE ingredient');
        $this->addSql('DROP TABLE brew_stock');
        $this->addSql('DROP TABLE brew_ingredient');
        $this->addSql('DROP TABLE supplier');
        $this->addSql('DROP TABLE order_quantity');
        $this->addSql('DROP TABLE "order"');
        $this->addSql('DROP TABLE stock_not_order');
        $this->addSql('DROP TABLE ingredient_stock');
        $this->addSql('DROP TABLE customer');
        $this->addSql('DROP TABLE brew');
    }
}
