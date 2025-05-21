const express = require('express');
const router = express.Router();
const { getStats, getTimeline, getGeoData, getEvents, getYears, getThemes, getEventById, getSentimentDistribution } = require('../controllers/eventController');

// Routes pour les statistiques et données
router.get('/stats', getStats);
router.get('/sentiment-distribution', getSentimentDistribution);
router.get('/timeline', getTimeline);
router.get('/geo', getGeoData);
router.get('/events', getEvents);
router.get('/years', getYears);
router.get('/themes', getThemes);
router.get('/events/:id', getEventById);

module.exports = router;