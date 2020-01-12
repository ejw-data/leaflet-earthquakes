  //START MAIN CODE
  
  var map = L.map("map", {
    center: [37.5, -98.35],
    zoom: 4
  });

  var controlLayers = L.control.layers(null, null, {collapsed:false}).addTo(map);

  var earthquakeData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  d3.json(earthquakeData, function(response) {
    // console.log(response)
    var earthquakes = L.geoJSON(response.features, {
      onEachFeature: onEachFeature,
      pointToLayer: onEachMarker
    }).addTo(map);
    controlLayers.addOverlay(earthquakes, "Earthquakes");
  });

  var faultData = "static/data/faultLines.json";
  d3.json(faultData, function(faultgeo) {
    var faults = L.geoJSON(faultgeo.features,{
      style: function(feature){
        return {
          color: "red",
          weight: 1.5,
          opacity: 0.8
        };
      }
    }).addTo(map);
    controlLayers.addOverlay(faults, "Fault Lines");
  });

  // Sending our earthquakes layer to the createMap function
  createMap();
  legendAdd();

//END MAIN CODE

  //the createMap() is used in the MAIN section
  function createMap() {
  // Adding tile layer
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 22,
      id: "mapbox.streets",
      accessToken: API_KEY
    }).addTo(map);

    var grayscalemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.light",
      accessToken: API_KEY
    });
    
    var outdoormap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.satellite",
      accessToken: API_KEY
    });

  
    // L.control.layers(null, baseMaps, {collapsed: false}).addTo(map);   //removed 'overlayMaps' as first element in list
    controlLayers.addBaseLayer(streetmap, "Street Map");  
    controlLayers.addBaseLayer(grayscalemap, "Grayscale Map"); 
    controlLayers.addBaseLayer(outdoormap, "Outdoor"); 
  
  }

  //the legendAdd() could be added to the end of the createMap(); it is used in MAIN section
  function legendAdd(){
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function(map) {

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

  //markerSize() and markerColor() are used inside onEachMarker()
  function markerSize(magnitude) {
    //the richter scale is logarithmic(**10) but converting to a power or linear scale 
    //did not make the small mag and large mag circles look good; an exp() scale 
    //made the small circles bigger than linear and the large circles smaller than power
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

  //the next two fuctions are used in the MAIN section
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  function onEachMarker(feature, latlng){
    return new L.Circle(latlng, {
      radius: markerSize(feature.properties.mag), 
      fillOpacity: 0.6,
      color: markerColor(feature.properties.mag),
      fillColor: markerColor(feature.properties.mag)
    });
  }