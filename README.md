# DÉMARCHE DE DÉVELOPPEMENT TECHNIQUE – GDELT BÉNIN ANALYTICS

Le projet **GDELT Bénin** a été conçu dans un cadre d'innovation data, avec un objectif clair : démontrer comment des compétences concrètes dans le domaine du Big Data et du developpement peuvent être mobilisées pour transformer des données massives en information stratégique pertinente.  Ce projet vise à :
- Extraire les données relatives au Bénin de la base de données GDELT.
- Analyser les données extraites pour identifier les tendances, les événements majeurs et les sentiments exprimés.
- Structurer les données pour faciliter leur utilisation dans des recherches ultérieures et des analyses prédictives.
- Fournir des données structurées pour l'élaboration de politiques publiques informées.


## 1. COLLECTE DES DONNÉES

### Source principale : GDELT

La base de données **GDELT (Global Database of Events, Language and Tone)** a été choisie pour sa richesse en données médiatiques internationales. Elle recense des millions d’événements et d’articles de presse, mis à jour toutes les 15 minutes.

#### Étapes :
- Interrogation de la base **GDELT V2** via **Google BigQuery**
- Filtres appliqués :
  - Pays concerné : Bénin
  - Période : [ 2014 - avril 2025]
  - Types d’événements : tous types, pour une couverture globale
- Résultat : export CSV contenant les métadonnées de chaque événement (date, source, URL, type d’événement, tonalité, etc.)

### Scraping des articles

Pour enrichir ces données brutes, nous avons scrappé les articles liés via leurs URLs.

- Outil utilisé : `BeautifulSoup` (Python)

#### Pourquoi BeautifulSoup ?
- Simple à utiliser
- Efficace pour extraire le texte principal des pages HTML
- Pas besoin de machine virtuelle ou d’installation lourde

#### Méthodologie :
- Ouverture de chaque URL
- Nettoyage du HTML (suppression des balises inutiles, scripts, etc.)
- Extraction du texte principal de l’article
- Gestion des erreurs (liens morts, redirections, etc.)


## 2. TRAITEMENT PAR INTELLIGENCE ARTIFICIELLE

Une fois les textes extraits, ils ont été enrichis à l’aide de l’IA pour générer des insights.

- API utilisée : Azure OpenAI (`GPT-4o`)
- Traitement en batch pour chaque article

### Fonctions IA déployées :
- Résumé automatique de l’article  
- Détection du thème dominant (politique, économie, santé, etc.)  
- Analyse du sentiment (positif, neutre, négatif)  

Tous les résultats sont sauvegardés dans un fichier final structuré.


## 3. STRUCTURATION ET EXPORT DES DONNÉES

### Stockage local au format Excel (`.xlsx`)

Les résultats finaux ont été regroupés dans un fichier Excel, structuré avec les colonnes suivantes :

- Date de l’événement
- Lien de l’article
- Titre
- Texte complet
- Résumé IA
- Thème détecté
- Sentiment (positif, neutre, négatif)
- Pays d’origine de la source
- Score de tonalité de GDELT
- Score de confiance du scraping

Ce format facilite les analyses exploratoires et les exports vers Power BI, Tableau, Google Sheets, etc.


## 4. VISUALISATION INTERACTIVE

### Outil utilisé : Plotly.js

L’interface de visualisation a été développée comme un dashboard web interactif, en JavaScript (sans framework lourd), avec les librairies suivantes :

- `Plotly.js` : pour les graphiques interactifs  
- `Leaflet` : pour la carte mondiale des sources  
- `Bootstrap` : pour le design réactif

### Fonctions du dashboard :
- Filtres dynamiques (période, sentiment, thème)
- Graphiques linéaires et circulaires :
  - Sentiment par période
  - Thème par fréquence
- Carte du monde montrant la provenance des sources médiatiques
- Tableau interactif des articles enrichis

## 5. TESTS & VALIDATION

Avant la présentation, plusieurs vérifications ont été effectuées :

- Validation des URLs et correction des erreurs de scraping
- Vérification manuelle de certains résumés IA pour la qualité
- Nettoyage des doublons
- Contrôle de la cohérence des scores de sentiment avec le contenu réel

## CONCLUSION TECHNIQUE

Ce projet a permis de mobiliser :
- Des compétences en exploration de bases de données massives
- Du scraping avancé avec BeautifulSoup
- L’intégration d’un modèle IA de génération avancée
- Le traitement de données textuelles multilingues
- La création d’un dashboard réactif et interactif
