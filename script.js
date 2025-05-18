const timeInput = document.getElementById("dureeHeure") ;
const distanceInput = document.getElementById("distance") ;
const proxiInput = document.getElementById("proximite") ;
const titreCarteTracer = document.querySelector(".tirte-carte-rando");
const buttonChearch = document.querySelector(".button-chearch");
const displayName = document.querySelector(".box-title p");
const displayDistance = document.querySelector(".box-descrp #distance");
const displayDuree = document.querySelector(".box-descrp #duree");
const displayDescr = document.querySelector(".box-descrp #description-rando");
console.log(displayDescr,displayName,displayDistance,displayDuree)

let macarte = null;
let macarte2 = null;
let time = 10;
let distance = 10;
let distMax = 20;
let donnee = null;
let longUser = null;
let latUser = null;
let listeRando = []
let marker1 = null; //definition global *
// Fonction d'initialisation de la carte
function initMap(lat, lon) {
    // Créer l'objet "macarte" et l'insèrer dans l'élément HTML qui a l'ID "map"
    try{
        macarte = L.map('map').setView([lat, lon], 11);
        // Leaflet ne récupère pas les cartes (tiles) sur un serveur par défaut. Nous devons lui préciser où nous souhaitons les récupérer. Ici, openstreetmap.fr
        L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
            // Il est toujours bien de laisser le lien vers la source des données
            attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
            minZoom: 1,
            maxZoom: 20
        }).addTo(macarte);
        let marker = L.marker([lat, lon]).addTo(macarte);
        marker.bindPopup("votre localisation");
    }catch{}


    for (let i = 0; i<listeRando.length;i++){

        const locRando = listeRando[i]["randonnee_localisation"].split(";");
        const longRando = parseFloat(locRando[1]);
        const latRando = parseFloat(locRando[0]);
        marker1 = L.marker([latRando, longRando]); //let
        marker1.bindPopup(listeRando[i]["randonnee_nom"]);
        marker1.addTo(macarte);
        marker1.addEventListener("click" , async (e)=>{

            // afiichage description //

            displayName.textContent = listeRando[i]['randonnee_nom'];
            displayDistance.textContent = listeRando[i]['randonnee_distance'];
            displayDuree.textContent = listeRando[i]['randonnee_duree'];
            displayDescr.textContent = listeRando[i]['randonnee_descr']
            titreCarteTracer.textContent = listeRando[i]['randonnee_nom']
            // affichage carte  //

            console.log("id:",listeRando[i]['randonnee_id']);
            // let response = await fetch('gpx_files/'+listeRando[i]['randonnee_id']+".gpx"); 
            let response = await fetch('gpx_files/' + listeRando[i]['randonnee_id'] + '.gpx');
            let gpx = await response.text();
            gpx = gpx.slice(2,-1);
            gpx = gpx.replace(/\\n/g, '\n')
                .replace(/\\"/g, '"')
                .replace(/\\'/g, "'")
                .replace(/\\\\/g, '\\');
            console.log("GPX cleaned preview:", gpx.slice(0, 100));
            // console.log(macarte2)
            // if (!macarte2) {
            //     console.warn("Carte non initialisée !");
            //     return;
            // }
            if (!gpx.startsWith("<?xml")) {
                console.error("Le fichier GPX n'est pas bien interprété !");
            }
            // new L.GPX(gpx, {async: true}).on('loaded', function(e) {
            //     macarte2.fitBounds(e.target.getBounds());
            // }).addTo(macarte2);
            // // L.control.layers(null, { 'Trace GPX': gpxLayer }).addTo(macarte2);

            // console.log(macarte2)
            try{
                macarte2.clearLayers();
            }catch{
            }
            let trajet = new L.GPX(gpx, {async: true}).on('loaded', function(e) {
                macarte2.fitBounds(e.target.getBounds());
            }).addTo(macarte2);
            // L.control.layers(null, { 'Trace GPX': gpxLayer }).addTo(macarte2);
        
            console.log(macarte2)
        })
    }

}



function initMapTrajet(lat, lon,id) {
     // Créer l'objet "macarte" et l'insèrer dans l'élément HTML qui a l'ID "map"
    macarte2 = L.map('map-trajet').setView([lat, lon], 11);



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
        console.log(latUser)
        const response = await fetch('api.php');
        data = await response.json();
        console.log(data);

        getproxi();

        initMap(latUser,longUser,macarte); 
        initMapTrajet(latUser,longUser,macarte2);

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
    return long*111*Math.cos(lat*(Math.PI/180)) //calcul de la long en kilometre
}



function getproxi(){  // renvoie une liste avec les rando à moins de 10km de la position de l'user
    for (let i =0; i<data.length; i++){
        const locRando = data[i]["randonnee_localisation"].split(";");
        const longRando = locRando[1];
        const latRando = locRando[0];
        let time2 = data[i]["randonnee_duree"].split(" ");
        time2 = parseFloat(time2[0].split(":").join("."));
        let distance_rando = data[i]["randonnee_distance"].split(" ");
        distance_rando = parseFloat(distance_rando[0])
        if ((longToKm(longRando,latRando)-longToKm(longUser,latUser))**2 + (latToKm(latRando)-latToKm(latUser))**2 <= distMax**2 &&  time2<=time && distance_rando<=distance){ // calcul de distance : n  = dist max
            listeRando.push(data[i])
            console.log(time2,distance_rando)
        }
    }
    console.log(listeRando)



}


buttonChearch.addEventListener("click" ,() =>{
    console.log("event");
    if(timeInput.value != null){
        time = timeInput.value
    }
    if(distanceInput.value != null){
        distance = distanceInput.value
    }
    if(proxiInput.value != null){
        distMax = proxiInput.value
    }

    const taille = listeRando.length;
    for (let i = 0;i<taille;i++){
        
        listeRando.pop()
    }
    getproxi()
    initMap()
});


