
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  SQLDATE: Number,
  Actor1Name: {type: String, default: "Acteur 1 non disponible"},
  Actor2Name: {type: String, default: "Acteur 2 non disponible"},
  EventCode: String,
  QuadClass: Number,
  GoldsteinScale: Number,
  AvgTone: Number,
  ActionGeo_FullName: String,
  SOURCEURL: { type: String, unique: true },
  ArticleText: {type: String, default: "Article non disponible"},
  themes: {type: String, default: "Theme non disponible"},
  summary:{type: String, default: "Résumé non disponible"},
  sentiment: String,
  Year: Number,
  Month: Number,
  Day: Number,
  processed_at: { type: Date, default: Date.now }
});

// Ajouter des index pour optimiser les requêtes fréquentes
eventSchema.index({ Year: 1 });
eventSchema.index({ sentiment: 1 });
eventSchema.index({ ActionGeo_FullName: 1 });

const Event = mongoose.model('Event', eventSchema, 'events');

module.exports = Event;