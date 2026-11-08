const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

// Route: Initialize new heist game mission (Level 1, 60s timer)
router.post('/start', gameController.startMission);

// Route: Submit puzzle answer, evaluate events, timer, alerts & demotion
router.post('/submit', gameController.submitAnswer);

module.exports = router;

