
let donnee = null;
let longUser = null;
let latUser = null;
let listeRando = []
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
// window.onload = function(){
//     const succes = (position) =>{
//         const {latitude, longitude}=position.coords;
//         let lat = latitude;
//         latUser = lat
//         let lon = longitude;
//         let macarte = null;
//         let macarte2 = null;
//         initMap(lat,lon,macarte); 
//         initMapTrajet(lat,lon,macarte2);
//     };
    
//     const error = (error) =>{
//         console.warn(error.message);
//     };
    
//     // Fonction d'initialisation qui s'exécute lorsque le DOM est chargé
//     navigator.geolocation.getCurrentPosition(succes,error);
//     fetch('../api.php')
//         .then(response => response.json())
//         .then(data => {
//     console.log(data); // Tu peux afficher ça ou l'injecter dans le HTML
//     donnee = data
//   })
//   .catch(error => console.error('Erreur :', error));
//   getproxi()
// };


function getPosition(){
    return new Promise((resolve,reject)=>{
        navigator.geolocation.getCurrentPosition(resolve,reject);
    });
}

async function init(){
    try{
        const position = await getPosition();
        const {latitude, longitude} = position.coords;
        latUser = latitude;
        longUser = longitude;
        let macarte = null;
        let macarte2 = null;
        initMap(latUser,longUser,macarte); 
        initMapTrajet(latUser,longUser,macarte2);

        const response = await fetch('../api.php');
        data = await response.json();
        console.log(data);

        getproxi();
    }catch (error) {
        console.error('Erreur attrapée dans init() :', error);
    }
}


window.onload = init();
// localisation

const latToKm = (lat) =>{  // calcul de la lat en kilometre
    return lat*111
}
const longToKm = (long,lat) =>{
    return long *111*Math.cos(lat*(Math.PI/180)) //calcul de la long en kilometre
}

function displayMap(){

}

function getproxi(){  // renvoie une liste avec les rando à moins de 10km de la position de l'user
    for (let i =0; i<data.length; i++){
        const locRando = data[i]["randonnee_localisation"].split(";");
        const longRando = locRando[1];
        const latRando = locRando[0];
        const distMax = 10;
        if ((longToKm(longRando,latRando)-longToKm(longUser,latUser))**2 + (latToKm(latRando)-latToKm(latUser))**2 <= distMax**2){ // calcul de distance : n  = dist max
            listeRando.push(data[i])
        }
    }
    displayMap()


}


