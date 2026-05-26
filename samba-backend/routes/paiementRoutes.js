const express = require('express');
const router = express.Router();
const paiementController = require('../controllers/paiementController');

router.post('/valider', paiementController.validerPaiement);

module.exports = router;