
  


//   function setEachFeature(feature, layer) {
//     layer.bindPopup("<h3>" + feature.properties.STATENAME +
//       "</h3><hr><p>District (114th): " + feature.properties.DISTRICT + "</p>");



  var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

  d3.json(link, function(response) {
    // console.log(response)
    createFeatures(response.features);
  });


  function markerSize(magnitude) {
    return (Math.exp(magnitude)*2000);
  }
  
  function markerColor(magnitude){
    switch(true){
      case magnitude > 5:
        colorCode = "#FF0000"
        break;
      case magnitude > 4.5:
        colorCode = "#FF3300"
        break;
      case magnitude > 4:
        colorCode = "#FF6600"
        break;
      case magnitude > 3.5:
        colorCode = "#FF9900"
        break;
      case magnitude > 3:
        colorCode = "#FFCC00"
        break;
      case magnitude > 2.5:
        colorCode = "#FFFF00"
        break;
      case magnitude > 2:
        colorCode = "#CCFF00"
        break;
      case magnitude > 1.5:
        colorCode = "#99FF00"
        break;
      case magnitude > 1:
        colorCode = "#66FF00"
        break;
      case magnitude > 0.5:
        colorCode = "#33FF00"
        break;
      case magnitude <= 0.5:
        colorCode = "#00FF00"
        break;
      default:
        console.log("value of magnitude is less than 0");
        colorCode = "black"
        break;
    }
    // colorCode = "white"
    return colorCode;
  
  }

  function createFeatures(data) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");

      // L.cirlce(feature.geometry.coordinates, {
      //   stroke: false,
      //   fillOpacity: 0.75,
      //   color: "white",
      //   fillColor: "white",
      //   radius: markerSize(feature.properties.mag)
      // });
      }
    
    function onEachMarker(feature, latlng){
      return new L.Circle(latlng, {
        radius: markerSize(feature.properties.mag), 
        fillOpacity: 0.6,
        color: markerColor(feature.properties.mag),
        fillColor: markerColor(feature.properties.mag)
      });
    }
  
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    // var earthquakes = L.geoJSON(earthquakeData, {
    //   onEachFeature: onEachFeature
    // });

   
   var earthquakes = L.geoJSON(data, {
      onEachFeature: onEachFeature,
      pointToLayer: onEachMarker
    });
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
  }

  function createMap(earthquakes) {
  // Adding tile layer
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 22,
      id: "mapbox/streets-v11",
      accessToken: API_KEY
    });

    var grayscalemap = L.tileLayer("https://api.tiles.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox/light-v10",
      accessToken: API_KEY
    });
    
    var outdoormap = L.tileLayer("https://api.tiles.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox/satellite-streets-v11",
      accessToken: API_KEY
    });


    var baseMaps = {
      "Streets": streetmap,
      "Grayscale": grayscalemap,
      "Outdoors": outdoormap
    };

    var overlayMaps = {
      Earthquakes: earthquakes
    };
  

    var map = L.map("map", {
      center: [37.5, -98.35],
      zoom: 4,
      layers:[streetmap, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(map);


    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'info legend'),
      grades = ['#FF0000', '#FF6600','#FFCC00', '#CCFF00','#66FF00','#00FF00'],
      labels = ['5+', '4-5', '3-4', '2-3', '1-2', '0-1'];
      // from, to;

      div.innerHTML='<div><h4>Legend</h4></div>';

      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
        div.innerHTML+="<i style='background:" + grades[i] + "'>&nbsp;&nbsp;</i>&nbsp;&nbsp;"+labels[i]+'<br/>';
        
      }
      return div;
    }
    legend.addTo(map);
  }

