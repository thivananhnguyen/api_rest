require("dotenv").config(); // Chargement des variables d'environnement 
const { Pool } = require("pg"); //Importation du module pg 

// Détection de l'environnement de production 
const isProduction = process.env.NODE_ENV === "production";

// Construction de la chaîne de connexion :
const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

// Cette ligne crée une instance de Pool pour gérer les connexions à la base de données.
const pool = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
  ssl: isProduction
});

module.exports = { pool };



