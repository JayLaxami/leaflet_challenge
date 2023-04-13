// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
  });

  function createFeatures(earthquakeData, platesData) {

    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><hr><p>Magnitude: ${feature.properties.mag}</p><hr><p>Number of "Felt" Reports: ${feature.properties.felt}`);
    }

    function createCircleMarker(feature,latlng) {
      let options = {
        radius : feature.properties.mag*5,
        fillColor: chooseColor(feature.properties.mag),
        color: chooseColor(feature.properties.mag),
        opacity: 1,
        fillOpacity: 0.7,
        weight: 1
      }
      return L.circleMarker(latlng,options);
    }
  
    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    // Send our earthquakes layer to the createMap function/
    let earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
      pointToLayer : createCircleMarker
    });

    createMap(earthquakes);
}   
  
function chooseColor(mag){
    if (mag <= 1) {
      return "#ADFF2F"
    } else if (mag <= 2) {
      return "#9ACD32"
    } else if (mag <= 3) {
      return "#FFD700"
    } else if (mag <= 4) {
      return "#FFA500"
    } else if (mag <= 5) {
      return "#FF6347"
    } else {
      return "#FF4500"
    }
}

let legend = L.control({position: "bottomright"});
legend.onAdd = function() {
    var div = L.DomUtil.create('div', 'info legend');
    var grades = [0, 1, 2, 3, 4, 5];
    var labels = [];
    var legendInfo = "<h5>Magnitude</h5>";

    div.innerHTML = legendInfo

    for (let i = 0; i < grades.length; i++) {
      labels.push('<li style = "background-color:' + chooseColor(grades[i] + 1) + '"> <span>' + grades[i] + (grades[i+1] ? '&ndash;' + grades[i+1] + '': '+') + '</span></li>');
    }
      div.innerHTML += "<ul>" + labels.join("")+ "</ul>";
    return div;
  };
function createMap(earthquakes) {
  
    // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
    // Create a baseMaps object.
    let baseMaps = {
      "Street Map": street,
      "Topographic Map": topo
    };
  
    // Create an overlay object to hold our overlay.
    let overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    let map = L.map("map", {
      center: [
        38.8148346, -122.8191681
      ],
      zoom: 4,
      layers: [street, earthquakes]
    });
  

     // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);
  legend.addTo(map);
};  
 


  