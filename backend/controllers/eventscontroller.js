const Event = require('../models/event');

// Obtenir les statistiques globales
exports.getStats = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    
    const avgToneResult = await Event.aggregate([
      { $group: { _id: null, avgTone: { $avg: "$AvgTone" } } }
    ]);
    
    const avgGoldsteinResult = await Event.aggregate([
      { $group: { _id: null, avgGoldstein: { $avg: "$GoldsteinScale" } } }
    ]);
    
    const sentimentCounts = await Event.aggregate([
      { $group: { _id: "$Sentiment", count: { $sum: 1 } } }
    ]);
    
    const stats = {
      totalEvents,
      avgTone: avgToneResult.length > 0 ? avgToneResult[0].avgTone : 0,
      avgGoldstein: avgGoldsteinResult.length > 0 ? avgGoldsteinResult[0].avgGoldstein : 0,
      sentimentDistribution: sentimentCounts
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir la timeline des événements
exports.getTimeline = async (req, res) => {
  try {
    const { year, sentiment, theme } = req.query;
    
    // Construction du filtre
    const filter = {};
    if (year) filter.Year = parseInt(year);
    if (sentiment) filter.Sentiment = sentiment;
    if (theme) filter.theme = theme;
    
    const timelineData = await Event.aggregate([
      { $match: filter },
      { $group: { 
        _id: { year: "$Year", month: "$Month" }, 
        count: { $sum: 1 },
        avgTone: { $avg: "$AvgTone" }
      }},
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);
    
    res.json(timelineData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir les données géographiques
exports.getGeoData = async (req, res) => {
  try {
    const { year, sentiment, theme } = req.query;
    
    // Construction du filtre
    const filter = {};
    if (year) filter.Year = parseInt(year);
    if (sentiment) filter.Sentiment = sentiment;
    if (theme) filter.Theme = theme;
    
    const geoData = await Event.aggregate([
      { $match: filter },
      { $group: { 
        _id: "$ActionGeo_FullName", 
        count: { $sum: 1 },
        avgTone: { $avg: "$AvgTone" },
        events: { $push: { 
          eventCode: "$EventCode", 
          goldstein: "$GoldsteinScale",
          quadClass: "$QuadClass",
          url: "$SOURCEURL"
        }}
      }}
    ]);
    
    res.json(geoData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir les événements avec pagination
exports.getEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10, year, sentiment, theme } = req.query;
    
    // Construction du filtre
    const filter = {};
    if (year) filter.Year = parseInt(year);
    if (sentiment) filter.Sentiment = sentiment;
    if (theme) filter.Theme = theme;
    
    const events = await Event.find(filter)
      .sort({ SQLDATE: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await Event.countDocuments(filter);
    
    res.json({
      events,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir les années disponibles
exports.getYears = async (req, res) => {
  try {
    const years = await Event.distinct('Year');
    res.json(years.sort());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir les themes disponibles
exports.getThemes = async(req, res) => {
  try {
    const themes = await Event.distinct('themes');
    res.json(themes.sort());
  } catch (error) {
    res.status(500).json({ message: "erreur lors de la récupération des themes", error})
  }
}

// Obtenir un événement par ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }
    
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};