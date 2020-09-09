# Brakolu API

## Configuration

Pour installer le serveur, il suffit de lancer la commande suivante dans le dossier *Backend*:
```bash
composer install
```
Pour lancer le serveur sans restriction de port et pour le développement:
```bash
php -S 0.0.0.0:8000 -t public/
```
La documentation de l'API est disponible à l'adresse suivante: http://127.0.0.1:8000/api/doc

Pour lancer les tests fonctionnelles, il faut éteindre le serveur PHP puis lancer la commande:
```bash
vendor/bin/behat features/ --stop-on-failure
```
### Base de données

Création de la base de données de l'environnement actuel :
```bash
php bin/console doctrine:database:create
```
Pour créer une nouvelle classe ou ajouter des attributs à une classe, le CLI 
suivant permet de réaliser ça.
```bash
php bin/console make:entity
```
Création d'un fichier de migration lorsque les entitées ont été modifiées:
```bash
php bin/console make:migration
```
Mise à jour de la base de données pour prendre en compte les nouveaux champs et les 
nouvelles classes :
```bash
php bin/console doctrine:migrations:migrate
```

Pour plus d'information suivre la documentation: https://symfony.com/doc/current/doctrine.html
