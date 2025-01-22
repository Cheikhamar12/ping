# MIKANA - Système de Gestion Intelligente du Linge

## Prérequis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants :

- [Node.js](https://nodejs.org/) (version LTS recommandée)
- [MySQL Workbench](https://dev.mysql.com/downloads/workbench/)

## Installation et Configuration

### 1. Base de données

1. Installez MySQL Workbench
2. Lancez MySQL Workbench et connectez-vous
3. Créez une nouvelle base de données nommée "ping"
4. Importez le schéma de base de données (fichier SQL fourni)

### 2. Backend

1. Ouvrez un terminal
2. Naviguez vers le répertoire backend :
   ```bash
   cd Backend
   ```
3. Créez un environnement virtuel :
   ```bash
   python -m venv venv
   ```
4. Activez l'environnement virtuel :
   - Windows : `venv\Scripts\activate`
   - Linux/Mac : `source venv/bin/activate`
5. Installez les dépendances :
   ```bash
   pip install -r requirements.txt
   ```
6. Lancez le serveur :
   ```bash
   cd Backend
   npm start
   ```
   Le serveur démarrera sur http://localhost:5000

### 3. Frontend

1. Ouvrez un nouveau terminal
2. Naviguez vers le répertoire frontend :
   ```bash
   cd Frontend
   ```
3. Installez les dépendances :
   ```bash
   npm install
   ```
4. Lancez l'application :
   ```bash
   npm start
   ```
   L'application sera accessible sur http://localhost:3000

## Gestion des branches

Pour contribuer au projet, suivez ces bonnes pratiques :

1. Ne travaillez pas directement sur la branche `main`
2. Les branches ont été crées pour chaque personne qui travaille sur le projet veuillez les choisir et les utiliser avant de commencer
   ```


3. Avant de créer une Pull Request :
   - Assurez-vous que votre code fonctionne
   - Mettez à jour votre branche avec la dernière version de main :
     ```bash
     git checkout main
     git pull
     git checkout votre-branche
     git merge main
     ```


