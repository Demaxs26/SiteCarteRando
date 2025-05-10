
// Fonction d'initialisation de la carte
function initMap(lat, lon,macarte) {
    // Créer l'objet "macarte" et l'insèrer dans l'élément HTML qui a l'ID "map"
    macarte = L.map('map').setView([lat, lon], 11);
    // Leaflet ne récupère pas les cartes (tiles) sur un serveur par défaut. Nous devons lui préciser où nous souhaitons les récupérer. Ici, openstreetmap.fr
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        // Il est toujours bien de laisser le lien vers la source des données
        attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
        minZoom: 1,
        maxZoom: 20
    }).addTo(macarte);
}
function initMapTrajet(lat, lon,macarte2) {
    // Créer l'objet "macarte" et l'insèrer dans l'élément HTML qui a l'ID "map"
    macarte2 = L.map('map-trajet').setView([lat, lon], 11);
    // Leaflet ne récupère pas les cartes (tiles) sur un serveur par défaut. Nous devons lui préciser où nous souhaitons les récupérer. Ici, openstreetmap.fr
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        // Il est toujours bien de laisser le lien vers la source des données
        attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
        minZoom: 1,
        maxZoom: 20
    }).addTo(macarte2);
}
window.onload = function(){
    const succes = (position) =>{
        const {latitude, longitude}=position.coords;
        var lat = latitude;
        var lon = longitude;
        var macarte = null;
        var macarte2 = null;
        initMap(lat,lon,macarte); 
        initMapTrajet(lat,lon,macarte2);
    };
    
    const error = (error) =>{
        console.warn(error.message);
    };
    
    // Fonction d'initialisation qui s'exécute lorsque le DOM est chargé
    navigator.geolocation.getCurrentPosition(succes,error);
    fetch('http://127.0.0.1/randonneeNSI/api.php')
        .then(response => response.json())
        .then(data => {
    console.log(data); // Tu peux afficher ça ou l'injecter dans le HTML
    getproxi(data,lon,lat)
  })
  .catch(error => console.error('Erreur :', error));
    
};





// localisation
function getproxi(data,long,lat){
    console.log(data[1])
}


