// Configuration de l'API
const API_URL = 'http://localhost:5000/api';
let currentPage = 1;
let totalPages = 1;

// État des filtres
let filters = {
  year: '',
  sentiment: '',
  theme: ''
};

// Fonction pour charger les années disponibles
async function loadYears() {
  try {
    const response = await fetch(`${API_URL}/years`);
    const years = await response.json();
    
    const yearSelect = document.getElementById('yearSelect');
    yearSelect.innerHTML = '<option value="">Toutes les années</option>';
    years.forEach(year => {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      yearSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Erreur lors du chargement des années:', error);
  }
}

// Fonction pour charger les thèmes disponibles
async function loadThemes() {
  try {
    const response = await fetch(`${API_URL}/themes`);
    const themes = await response.json();
    
    const themeSelect = document.getElementById('themeSelect');
    themeSelect.innerHTML = '<option value="">Tous les thèmes</option>';
    themes.forEach(theme => {
      const option = document.createElement('option');
      option.value = theme;
      option.textContent = theme;
      themeSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Erreur lors du chargement des thèmes:', error);
  }
}

// Fonction pour charger les statistiques
// async function loadStats() {
//   try {
//     // Construire l'URL avec les filtres
//     let url = `${API_URL}/stats`;
//     const queryParams = [];
//     if (filters.year) queryParams.push(`year=${filters.year}`);
//     if (filters.sentiment) queryParams.push(`sentiment=${filters.sentiment}`);
//     if (filters.theme) queryParams.push(`theme=${filters.theme}`);
//     if (queryParams.length > 0) {
//       url += `?${queryParams.join('&')}`;
//     }

//     const response = await fetch(url);
//     const stats = await response.json();

//     // Mettre à jour les statistiques dans l'interface
//     document.getElementById('totalEvents').textContent = stats.totalEvents.toLocaleString();
//     document.getElementById('avgTone').textContent = stats.avgTone.toFixed(2);
//     document.getElementById('avgGoldstein').textContent = stats.avgGoldstein.toFixed(2);

//     // Préparer les données pour le camembert des sentiments
//     const sentimentLabels = stats.sentimentDistribution.map(item => item._id);
//     const sentimentValues = stats.sentimentDistribution.map(item => item.count);

//     const sentimentColors = {
//       'positif': 'rgba(75, 192, 75, 0.7)',
//       'négatif': 'rgba(255, 99, 132, 0.7)',
//       'neutre': 'rgba(255, 206, 86, 0.7)'
//     };

//     const colors = sentimentLabels.map(label => sentimentColors[label] || 'rgba(201, 203, 207, 0.7)');

//     Plotly.newPlot('sentimentChart', [{
//       labels: sentimentLabels,
//       values: sentimentValues,
//       type: 'pie',
//       marker: {
//         colors: colors
//       },
//       textinfo: 'label+percent',
//       insidetextorientation: 'radial'
//     }], {
//       title: {
//         text: 'Distribution des sentiments'
//       }
//     });

//   } catch (error) {
//     console.error('Erreur lors du chargement des statistiques:', error);
//   }
// }

async function loadStats() {
  try {
    // Construire l'URL avec les filtres
    let url = `${API_URL}/stats`;
    const queryParams = [];
    if (filters.year) queryParams.push(`year=${filters.year}`);
    if (filters.sentiment) queryParams.push(`sentiment=${filters.sentiment}`);
    if (filters.theme) queryParams.push(`theme=${filters.theme}`);
    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }
    
    const response = await fetch(url);
    const stats = await response.json();
    
    // Mettre à jour les statistiques dans l'interface
    document.getElementById('totalEvents').textContent = stats.totalEvents.toLocaleString();
    document.getElementById('avgTone').textContent = stats.avgTone.toFixed(2);
    document.getElementById('avgGoldstein').textContent = stats.avgGoldstein.toFixed(2);
    
    // Graphique de distribution des sentiments
    const sentimentLabels = stats.sentimentDistribution.map(item => item._id);
    const sentimentValues = stats.sentimentDistribution.map(item => item.count);
    
    const sentimentColors = {
      'positif': 'rgba(75, 192, 75, 0.7)',
      'négatif': 'rgba(255, 99, 132, 0.7)',
      'neutre': 'rgba(255, 206, 86, 0.7)'
    };
    
    const colors = sentimentLabels.map(label => sentimentColors[label] || 'rgba(201, 203, 207, 0.7)');
    
    Plotly.newPlot('sentimentChart', [{
      x: sentimentLabels,
      y: sentimentValues,
      type: 'line',
      marker: {
        colors: colors
      }
    }], {
      title: 'Distribution des sentiments',
      xaxis: {
        title: 'Sentiment'
      },
      yaxis: {
        title: 'Nombre d\'événements'
      }
    });
    
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error);
  }
}

// Fonction pour charger la timeline
async function loadTimeline() {
  try {
    // Construire l'URL avec les filtres
    let url = `${API_URL}/timeline`;
    const queryParams = [];
    if (filters.year) queryParams.push(`year=${filters.year}`);
    if (filters.sentiment) queryParams.push(`sentiment=${filters.sentiment}`);
    if (filters.theme) queryParams.push(`theme=${filters.theme}`);
    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }
    
    const response = await fetch(url);
    const timeline = await response.json();
    
    // Préparer les données pour le graphique
    const dates = timeline.map(item => `${item._id.year}-${item._id.month.toString().padStart(2, '0')}`);
    const counts = timeline.map(item => item.count);
    const tones = timeline.map(item => item.avgTone);
    
    // Créer le graphique temporel
    const trace1 = {
      x: dates,
      y: counts,
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Nombre d\'événements',
      line: {
        color: 'rgb(55, 128, 191)',
        width: 3
      }
    };
    
    const trace2 = {
      x: dates,
      y: tones,
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Ton moyen',
      yaxis: 'y2',
      line: {
        color: 'rgb(219, 64, 82)',
        width: 3
      }
    };
    
    const layout = {
      title: 'Évolution temporelle des événements',
      xaxis: {
        title: 'Date'
      },
      yaxis: {
        title: 'Nombre d\'événements',
        titlefont: {color: 'rgb(55, 128, 191)'},
        tickfont: {color: 'rgb(55, 128, 191)'}
      },
      yaxis2: {
        title: 'Ton moyen',
        titlefont: {color: 'rgb(219, 64, 82)'},
        tickfont: {color: 'rgb(219, 64, 82)'},
        overlaying: 'y',
        side: 'right'
      },
      legend: {
        x: 0.1,
        y: 1
      }
    };
    
    Plotly.newPlot('timelineChart', [trace1, trace2], layout);
    
  } catch (error) {
    console.error('Erreur lors du chargement de la timeline:', error);
  }
}

// Fonction pour visualiser les sentiments sous forme de Camenbert
async function loadSentimentPieChart() {
  try {
    let url = `${API_URL}/sentiment-distribution`;
    const queryParams = [];
    if (filters.year) queryParams.push(`year=${filters.year}`);
    if (filters.sentiment) queryParams.push(`sentiment=${filters.sentiment}`);
    if (filters.theme) queryParams.push(`theme=${filters.theme}`);
    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }

    const response = await fetch(url);
    const statistique = await response.json();

    const sentimentLabels = statistique.sentimentDistribution.map(item => item._id);
    const sentimentValues = statistique.sentimentDistribution.map(item => item.count);

    const pieColors = {
      'positif': 'rgba(75, 192, 75, 0.7)',
      'négatif': 'rgba(255, 99, 132, 0.7)',
      'neutre': 'rgba(255, 206, 86, 0.7)'
    };

    const pieChartColors = sentimentLabels.map(label => pieColors[label] || 'rgba(201, 203, 207, 0.7)');

    Plotly.newPlot('sentimentPieChart', [{
      labels: sentimentLabels,
      values: sentimentValues,
      type: 'pie',
      marker: {
        colors: pieChartColors
      },
      textinfo: "label+percent",
      hoverinfo: "label+value"
    }], {
      title: 'Répartition des sentiments',
    });

  } catch (error) {
    console.error('Erreur lors du chargement du camembert des sentiments :', error);
  }
}


// Fonction pour charger les données géographiques
async function loadGeoData() {
  try {
    // Construire l'URL avec les filtres
    let url = `${API_URL}/geo`;  // Corrigé pour correspondre au backend
    const queryParams = [];
    if (filters.year) queryParams.push(`year=${filters.year}`);
    if (filters.sentiment) queryParams.push(`sentiment=${filters.sentiment}`);
    if (filters.theme) queryParams.push(`theme=${filters.theme}`);
    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }
    
    const response = await fetch(url);
    const geoData = await response.json();
    
    // Préparer les données pour la carte
    // Utilisation des données dynamiques plutôt que valeurs en dur
    
    const locations = geoData.map(item => item._id);
    const sizes = geoData.map(item => Math.min(50, Math.max(10, item.count * 2)));
    const texts = geoData.map(item => `${item._id}<br>Nombre d'événements: ${item.count}<br>Ton moyen: ${item.avgTone.toFixed(2)}`);
    
    // Créer des couleurs basées sur le ton moyen
    const colors = geoData.map(item => {
      const tone = item.avgTone;
      if (tone > 0) return `rgb(${Math.min(255, 200 - tone * 10)}, 200, ${Math.min(255, 200 - tone * 10)})`;
      return `rgb(200, ${Math.min(255, 200 + tone * 10)}, ${Math.min(255, 200 + tone * 10)})`;
    });
    

    const countryCodes = geoData.map(item => {
      return "BJ"; 
    });
    
    const data = [{
      type: "scattergeo",
      mode: "markers",
      locations: countryCodes,
      locationmode: "ISO-3",
      marker: {
        size: sizes,
        color: colors,
        line: {
          width: 1,
          color: 'rgb(40, 40, 40)'
        }
      },
      text: texts,
      hoverinfo: "text"
    }];
    
    const layout = {
      title: 'Distribution géographique des événements',
      geo: {
        scope: 'africa',
        resolution: 50,
        center: {
          lat: 9.3077,  // Latitude du Bénin
          lon: 2.3158   // Longitude du Bénin
        },
        projection: {
          scale: 5
        },
        showland: true,
        landcolor: 'rgb(217, 217, 217)',
        showocean: true,
        oceancolor: 'rgb(204, 229, 255)',
        showcountries: true,
        countrycolor: 'rgb(30, 30, 30)'
      }
    };
    
    Plotly.newPlot('map', data, layout);
    
  } catch (error) {
    console.error('Erreur lors du chargement des données géographiques:', error);
  }
}

// Fonction pour charger les événements avec pagination
async function loadEvents(page = 1) {
  try {
    const eventsLoader = document.getElementById('eventsLoader');
    if (eventsLoader) {
      eventsLoader.style.display = 'block';
    }
    
    document.getElementById('eventsList').innerHTML = '<div class="loader" id="eventsLoader"></div>';
    
    // Construire l'URL avec les filtres et la pagination
    let url = `${API_URL}/events?page=${page}&limit=10`;
    if (filters.year) url += `&year=${filters.year}`;
    if (filters.sentiment) url += `&sentiment=${filters.sentiment}`;
    if (filters.theme) url += `&theme=${filters.theme}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    currentPage = data.currentPage;
    totalPages = data.totalPages;
    
    // Créer la liste des événements
    const eventsList = document.getElementById('eventsList');
    eventsList.innerHTML = '';
    
    if (data.events.length === 0) {
      eventsList.innerHTML = '<div class="alert alert-info">Aucun événement trouvé pour ces critères.</div>';
    } else {
      const list = document.createElement('div');
      list.className = 'list-group';
      
      data.events.forEach(event => {
        const eventItem = document.createElement('div');
        eventItem.className = 'list-group-item';
        
        let sentimentClass = '';
        if (event.Sentiment === 'positif') sentimentClass = 'sentiment-positive';
        else if (event.Sentiment === 'négatif') sentimentClass = 'sentiment-negative';
        else if (event.Sentiment === 'neutre') sentimentClass = 'sentiment-neutral';
        
        // Utilisez Theme au lieu de themes et vérifiez l'existence de summary
        const theme = event.themes || 'Non spécifié';
        const summary = event.summary || 'Pas de résumé disponible';
        
        eventItem.innerHTML = `
          <div class="d-flex justify-content-between align-items-center">
            <h2 class="mb-1">${formatDate(event.SQLDATE.toString())}</h2>
            <span class="badge bg-primary ${sentimentClass}"> ${event.sentiment}</span>
          </div>
          <p class="mb-1 "><strong>Thème Principal :</strong> ${theme}</p>
          <p class="mb-1"><strong>Acteur 1:</strong> ${event.Actor1Name || 'Non spécifié'}</p>
          <p class="mb-1"><strong>Acteur 2:</strong> ${event.Actor2Name || 'Non spécifié'}</p>
          <p class="mb-1"><strong>Lieu:</strong> ${event.ActionGeo_FullName}</p>
          <p class="mb-1"><strong>Résumé:</strong> ${summary}</p>
          <small><a href="${event.SOURCEURL}" target="_blank" class="text-decoration-none">Lien vers l'article source</a></small>
        `;
        
        list.appendChild(eventItem);
      });
      document.getElementById("downloadExcelBtn").addEventListener("click", downloadAllEventsExcel);

      eventsList.appendChild(list);
    }
    
    // Mettre à jour la pagination
    updatePagination();
    
    if (eventsLoader) {
      eventsLoader.style.display = 'none';
    }
    
  } catch (error) {
    console.error('Erreur lors du chargement des événements:', error);
    document.getElementById('eventsList').innerHTML = '<div class="alert alert-danger">Erreur lors du chargement des événements.</div>';
    
    const eventsLoader = document.getElementById('eventsLoader');
    if (eventsLoader) {
      eventsLoader.style.display = 'none';
    }
  }
}

// Fonction pour mettre à jour la pagination
function updatePagination() {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';
  
  // Bouton précédent
  const prevItem = document.createElement('li');
  prevItem.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
  prevItem.innerHTML = `<a class="page-link" ${currentPage !== 1 ? 'onclick="loadEvents(' + (currentPage - 1) + ')"' : ''}>Précédent</a>`;
  pagination.appendChild(prevItem);
  
  // Pages
  const maxPages = Math.min(5, totalPages);
  let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
  let endPage = Math.min(totalPages, startPage + maxPages - 1);
  
  if (endPage - startPage + 1 < maxPages) {
    startPage = Math.max(1, endPage - maxPages + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    const pageItem = document.createElement('li');
    pageItem.className = `page-item ${i === currentPage ? 'active' : ''}`;
    pageItem.innerHTML = `<a class="page-link" onclick="loadEvents(${i})">${i}</a>`;
    pagination.appendChild(pageItem);
  }
  
  // Bouton suivant
  const nextItem = document.createElement('li');
  nextItem.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
  nextItem.innerHTML = `<a class="page-link" ${currentPage !== totalPages ? "onclick='loadEvents(" + (currentPage + 1) + ")'" : ''}>Suivant</a>`;
  pagination.appendChild(nextItem);
}

// Fonction pour formater la date
function formatDate(sqlDate) {
  const year = sqlDate.substring(0, 4);
  const month = sqlDate.substring(4, 6);
  const day = sqlDate.substring(6, 8);
  
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('fr-FR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}


async function downloadAllEventsExcel() {
  try {
    let url = `${API_URL}/events?limit=10000`;
    if (filters.year) url += `&year=${filters.year}`;
    if (filters.sentiment) url += `&sentiment=${filters.sentiment}`;
    if (filters.theme) url += `&theme=${filters.theme}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.events || data.events.length === 0) {
      alert("Aucun événement trouvé pour ces filtres.");
      return;
    }

    const worksheetData = data.events.map(event => ({
      Date: formatDate(event.SQLDATE.toString()),
      Sentiment: event.sentiment,
      Thème: event.themes || "Non spécifié",
      "Acteur 1": event.Actor1Name || "Non spécifié",
      "Acteur 2": event.Actor2Name || "Non spécifié",
      Lieu: event.ActionGeo_FullName || "Non spécifié",
      Résumé: event.summary || "Pas de résumé disponible",
      "Lien Source": event.SOURCEURL || ""
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Événements");

    XLSX.writeFile(workbook, "benin_evenements.xlsx");
  } catch (error) {
    console.error("Erreur lors du téléchargement des événements :", error);
    alert("Une erreur est survenue lors du téléchargement.");
  }
}


// Fonction pour initialiser l'application
async function initApp() {
  // Charger les années disponibles
  await loadYears();
  
  // Charger les thèmes disponibles
  await loadThemes();

  // Charger les données initiales
  loadStats();
  loadSentimentPieChart();
  loadTimeline();
  loadGeoData();
  loadEvents();
  
  // Configurer les événements
  document.getElementById('applyFilters').addEventListener('click', function(event) {
  event.preventDefault();
    // Mettre à jour les filtres
    filters.year = document.getElementById('yearSelect').value;
    filters.sentiment = document.getElementById('sentimentSelect').value;
    filters.theme = document.getElementById('themeSelect').value;
    
    // Recharger les données avec les nouveaux filtres
    loadStats();
    loadSentimentPieChart();
    loadTimeline();
    loadGeoData();
    loadEvents(1); // Revenir à la première page
  });
}


// Ouvrir la modale Chatbot au clic du bouton
document.getElementById('openChatbot').addEventListener('click', () => {
  const myModal = new bootstrap.Modal(document.getElementById('chatbotModal'));
  myModal.show();
});




// Initialiser l'application au chargement
window.onload = initApp;