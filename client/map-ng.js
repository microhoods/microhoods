var app = angular.module('map-app', [])
.controller('map-controller', function($scope) {
  $scope.tag='';
  $scope.addTag=function () {
    if (drawnItems._layers[selectedLayerId]) {    
      var layer=drawnItems._layers[selectedLayerId];
      if (layer.label!==undefined) {
        tags=layer.label._content+', '+$scope.tag;
      } else {
        tags=$scope.tag
      }
      layer.bindLabel(tags);
      $scope.tag='';
    }
  };
  $scope.saveTags=function() {
    //get all tags from page
    var tags=createTags();
    //save tags into mongo
    var request = new XMLHttpRequest();
    request.open('POST', '/', true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send(JSON.stringify(tags));

    //clear all layers
    for (var layer in drawnItems._layers) {
      drawnItems.removeLayer(drawnItems._layers[layer]);
    }
    selectedLayerId=undefined;
  };
  $scope.communitySwitch=function() {
    //switch colors for two buttons
    document.getElementById("personalMap").style.background='#F28D7A';
    document.getElementById("communityMap").style.background='#DB5A55';

    //clear all layers
    for (var layer in drawnItems._layers) {
      drawnItems.removeLayer(drawnItems._layers[layer]);
    }
    selectedLayerId=undefined;

    //get tags from server and filter to most popular
    request = new XMLHttpRequest();
    request.open('GET', '/data', true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400){
        //repopulate map with most popular tags
        var allCoords=JSON.parse(request.responseText);
        for (var coord in allCoords) {
          if (coord!=='undefined') {
            var label=allCoords[coord]['label'];
            var sent=allCoords[coord]['sentiment'];
            L.circleMarker(JSON.parse(coord), {color: sentimentColors(sent), opacity: .9}).setRadius(5).addTo(map).bindLabel(label+' ('+sent.toFixed(1)+')');
          }
        }
      } 
    };
    request.onerror = function() {
      console.log('There was an error in sending your request.');
    };
    request.send();
  };
  $scope.personalSwitch=function() {
    //switch colors for two buttons
    document.getElementById("personalMap").style.background='#DB5A55';
    document.getElementById("communityMap").style.background='#F28D7A';

    //clear all layers
    for (var layer in map._layers) {
      if (layer!=='22' && layer!=='24') {
        map.removeLayer(map._layers[layer]);
      }
    }
    selectedLayerId=undefined;
  };
});

//set up global variables
var selectedLayerId;

//set increment for lat/lng granularity
var block=.001;
var conversion=1000
var digits=3;

//formats
var highlight = {
  'color': '#03606B'
};
var defaultShape = {
  'color': '#DB5A55'
};

//set map height
var height=document.body.scrollHeight-68;
document.getElementById("map").style.height=height.toString()+'px'

//initialize map to SF
var map = L.map('map', {zoomControl: false, maxBounds: [[37.7, -122.65], [37.85, -122.3]], minZoom: 12}).setView([37.789, -122.414], 14);
new L.Control.Zoom({ position: 'bottomleft' }).addTo(map);

L.tileLayer('http://api.tiles.mapbox.com/v3/austentalbot.gfeh9hg8/{z}/{x}/{y}.png', {attribution: '<a href="http://mapbox.com">Mapbox</a>', maxZoom: 18}).addTo(map);

// Initialise the FeatureGroup to store editable layers
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

// Initialise the draw control and pass it the FeatureGroup of editable layers
var drawControl = new L.Control.Draw({
  position: 'bottomleft',
  draw: {
    polygon: {
      shapeOptions: highlight
    },
    rectangle: {
      shapeOptions: highlight
    },
    polyline : false,
    circle : false,
    marker: false
  },
  edit: {
    featureGroup: drawnItems
  }
});
map.addControl(drawControl);

map.on('draw:created', function (e) {
    var type = e.layerType,
        layer = e.layer;

    // Add layer and listen for clicks
    map.addLayer(layer);
    drawnItems.addLayer(layer);
    layer.on('click', function(e) {
      //unhighlight old layer
      if (drawnItems._layers[selectedLayerId]) {
        drawnItems._layers[selectedLayerId].setStyle(defaultShape);
      }

      //switch selected layer to layer which has just been clicked
      selectedLayerId=e.target._leaflet_id;
      
      //highlight layer
      layer.setStyle(highlight);
    });

    //highlight and select layer
    if (drawnItems._layers[selectedLayerId]!==undefined) {
      drawnItems._layers[selectedLayerId].setStyle(defaultShape);
    }
    selectedLayerId=layer._leaflet_id;
});

map.on('draw:edited', function (e) {
    var layers = e.layers;
    selectedLayerId=undefined;
});

var findBoundaries=function(coordArr) {
  var boundaries={
    minLat: undefined,
    minLng: undefined,
    maxLat: undefined,
    maxLng: undefined
  };
  for (var c=0; c<coordArr.length; c++) {
    var coordinates=coordArr[c];
    if (coordinates.lat<boundaries.minLat || boundaries.minLat===undefined) {
      boundaries.minLat=coordinates.lat;
    }
    if (coordinates.lat>boundaries.maxLat || boundaries.maxLat===undefined) {
      boundaries.maxLat=coordinates.lat;
    }
    if (coordinates.lng<boundaries.minLng || boundaries.minLng===undefined) {
      boundaries.minLng=coordinates.lng;
    }
    if (coordinates.lng>boundaries.maxLng || boundaries.maxLng===undefined) {
      boundaries.maxLng=coordinates.lng;
    }
  }

  //set up check to limit boundaries to SF
  if (boundaries.minLat<37.7) {
    boundaries.minLat=37.7;
  }
  if (boundaries.maxLat>37.81) {
    boundaries.maxLat=37.81;
  }
  if (boundaries.minLng<-122.53) {
    boundaries.minLng=122.53;
  }
  if (boundaries.maxLng>-122.35) {
    boundaries.maxLng=-122.35
  }
  return boundaries;
};

var pointInPoly= function (point, polygon) {
  var convertToCoords=function(coordinates) {
    var coordArr=[];

    for (var i=0; i<coordinates.length; i++) {
      var coord=coordinates[i];
      var latLng=[coord['lat'], coord['lng']];
      coordArr.push(latLng);
    }
    return coordArr;
  };

  var vs=convertToCoords(polygon);
  var x = point[0], y = point[1];
  
  var inside = false;
  for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    var xi = vs[i][0], yi = vs[i][1];
    var xj = vs[j][0], yj = vs[j][1];
    
    var intersect = ((yi > y) != (yj > y))
      && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
};

var createTags=function() {
  var allTags={};
  for (id in drawnItems._layers) {
    var layer=drawnItems._layers[id];
    //only add labels for points where there are labels
    console.log(layer.label);
    if (layer.label!==undefined) {
      //loop over all points in boundaries
      var boundaries=findBoundaries(layer._latlngs);
      for (var i= parseFloat(boundaries.minLat.toFixed(digits)); i<=parseFloat((boundaries.maxLat+block).toFixed(digits)); i+=block) {
        var LAT=parseFloat(i.toFixed(digits));
        for (var j= parseFloat(boundaries.minLng.toFixed(digits)); j<=parseFloat((boundaries.maxLng+block).toFixed(digits)); j+=block) {
          var LNG=parseFloat(j.toFixed(digits));
          var point=[LAT, LNG];

          //check if each point in polygon
          if (pointInPoly(point, layer._latlngs)) {
            var strPoint=JSON.stringify(point)
            allTags[strPoint]=allTags[strPoint] || {};
            var tags=layer.label._content.split(', ');
            for (var k=0; k<tags.length; k++) {
              var tag=tags[k];
              //if point in poly, add point to dictionary and extend values of tags
              allTags[strPoint][tag] = allTags[strPoint][tag]+1 || 1;
            }
          }
        }
      }
    }
  }
  return allTags;
}

//set up various colors for markers based on sentiment -5 through 5
var sentimentColors = function (num) {
  if (num>3) {
    return '#1E5C59';
  } else if (num>2) {
    return '#377572';
  } else if (num>1) {
    return '#518F8C';
  } else if (num>.3) {
    return '#6AA8A5';
  } else if (num>=-.3) {
    return '#7f8c8d'
  } else if (num>=-1) {
    return '#F28D7A';
  } else if (num>=-2) {
    return '#D97461';
  } else if (num>=-3) {
    return '#BF5A47';
  } else {
    return '#A6412E';
  }
};
