# Serveur

## Installation

1. Créez un nouveau répertoire pour le serveur :
   ```bash
   mkdir server
   cd server
   ```
2. Initialisez un nouveau projet Node.js :
   ```bash
   npm init -y
   ```

## Dépendances

Installez les dépendances nécessaires :

1. Pour créer un serveur et gérer l'authentification :
   ```bash
   npm install express bcrypt passport express-session express-flash pg dotenv cors
   ```
2. Pour échapper les caractères HTML :
   ```bash
   npm install html-escaper
   ```
3. Pour utiliser JWT (JSON Web Tokens) :
   ```bash
   npm install jsonwebtoken bcrypt passport express cors dotenv express-flash pg
   ```
4. Pour générer une clé secrète aléatoire :
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

6. Pour la sécurité des en-têtes HTTP et la validation des données :
   ```bash
   npm install uuid  helmet express-validator 


   npm install pg pg-hstore
      npm install html-escaper
   ```
7. Pour l'envoi d'e-mails :
   ```bash
   npm install nodemailer
   ```

---
