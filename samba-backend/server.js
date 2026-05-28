require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); 

// --- IMPORT DES ROUTES ---
const contratRoutes = require('./routes/contratRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// 1. CONFIGURATION DE BASE
app.use(cors()); 
app.use(express.json()); 

// 2. GESTION DES FICHIERS (UPLOADS)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 3. MOUCHARD (LOGS)
app.use((req, res, next) => {
    console.log(`🚀 [${new Date().toLocaleTimeString()}] REQUÊTE : ${req.method} ${req.url}`);
    next();
});

// --- AJOUT : TEST DE SURVIE DIRECT ---
app.get('/test-serveur', (req, res) => {
    res.send("✅ Le serveur principal répond parfaitement sur Vercel !");
});

// 4. DÉCLARATION DES ROUTES API
app.use('/api/contrats', contratRoutes); 
app.use('/api/auth', authRoutes); 

// 5. LANCEMENT DU SERVEUR (UNIQUEMENT EN LOCAL)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`-------------------------------------------`);
        console.log(`✅ SERVEUR SAMBA-VOYAGE ACTIF SUR LE PORT ${PORT}`);
        console.log(`📂 Dossier uploads : /uploads [PRÊT]`);
        console.log(`🔑 Système d'authentification : [ACTIF]`);
        console.log(`-------------------------------------------`);
    });
}

// --- CONFIGURATION REQUIS POUR VERCEL ---
module.exports = app;