const jwt = require('jsonwebtoken');
const  { getUserByEmail } = require('../models/userModel');

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

    //TOKEN ADMIN
    const authenticateTokenAdmin = async (req, res, next) => { 
        const token = req.header('Authorization')?.split(' ')[1];
    if (!token) { 
        return res.status(401).json({ message: 'Token manquant' });
    }
    
    try {
    // Vérification et décodage du token :
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.user['email'];

        // Vérification du rôle de l'utilisateur :
        const user = await getUserByEmail(email);
        if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
        }
    
        next();
    } catch (error) {
        res.status(403).json({ message: 'Token admin invalide' });
    }
    }

module.exports = {  
    authenticateToken,
    authenticateTokenAdmin,
  };
