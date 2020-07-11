// Set the map center
var myMap = L.map("map", {
    center: [20, -30],
    zoom: 3
  });
  
// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
}).addTo(myMap);

// Define variables
data = "static/data/Meteorite_Landings_WorkingDatavF.csv";
largeMeteorite = 1000000;
midMeteorite = 250000;


// Create a color scale
function massColorScale(mass) {

    if (mass >= largeMeteorite) {
        fillColor = "#FD0F2B"; // red
    }
    else if (mass >= midMeteorite) {
        fillColor = "#FCFF00"; // yellow
    }
    else {
        fillColor = "#00FF40"; // lightgreen
    }
    return fillColor;
}

// A function for different circle radius size
function circleRadius(mass) {
    if (mass >= largeMeteorite) {
        outputRadius = 10;
    }
    else if (mass >= midMeteorite) {
        outputRadius = 6;
    }
    else {
        outputRadius = 3;
    }
    return outputRadius;
}
  
d3.csv(data).then(function(response) {

    // Draw a circle for every location
    for (var i = 0; i < response.length; i++) {

        var name = response[0].name;
        var lat = response[i].reclat;
        var lng = response[i].reclong;
        var mass = +response[i].mass;

        if (location) {
            var circleMarker = L.circleMarker([lat, lng], {
                            weight: 0.8,
                            color: "black",
                            fill: true,
                            fillColor: massColorScale(mass), 
                            fillOpacity: 0.7,
                            radius: circleRadius(mass),
                        }).addTo(myMap);
                        
            // Add popup for every circle
            circleMarker.bindPopup(`Name: ${name} <br>
                            Location: [${lat}, ${lng}]<br>
                            Mass: ${(mass/1000).toLocaleString('en-US')} Kg`
            );

            // Add hover feature
            circleMarker.on('mouseover', function (e) {
                this.openPopup();
            });
            circleMarker.on('mouseout', function (e) {
                this.closePopup();
            });
        }
    }

    // Add legend (Source: https://leafletjs.com/examples/choropleth/)
    var legend = L.control({position: 'bottomleft'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            massLevels = [0, midMeteorite, largeMeteorite],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < massLevels.length; i++) {
            div.innerHTML +=
                '<i style="background:' + massColorScale(massLevels[i]) + '"></i>' +
                massLevels[i]/ 1000 + (massLevels[i + 1] / 1000 ? '&ndash;' + massLevels[i + 1] / 1000+ ' <br>' : '+');
        }

        return div;
    };

    legend.addTo(myMap);
    
}).catch(function(error) 
            {return console.log(error);}
        );

