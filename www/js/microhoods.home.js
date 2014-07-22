var app = angular.module('microhoods.home', [])
.controller('map-controller', function($scope, $window, $state, fbAuth) {
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


  //place map on screen with correct proportions
  var height=$window.document.body.scrollHeight*.90;
  $window.document.getElementById("map").style.height=height.toString()+'px';
  var topPos=$window.document.body.scrollHeight*.06;
  $window.document.getElementById("map").style.top=topPos.toString()+'px';
  $window.document.getElementById("title").style.height=topPos.toString()+'px';
  $window.document.getElementById("personalMap").style.height=topPos.toString()+'px';
  $window.document.getElementById("communityMap").style.height=topPos.toString()+'px';

  //initialize map to SF
  var map = L.map('map', {zoomControl: false, attributionControl: false, maxBounds: [[37.7, -122.65], [37.85, -122.3]], minZoom: 12}).setView([37.789, -122.414], 14);

  L.tileLayer('http://api.tiles.mapbox.com/v3/imtiazmajeed.j17fdf0d/{z}/{x}/{y}.png', {maxZoom: 18}).addTo(map);

  // ADD IN LEAFLET DRAW HERE ONLY IF ACCESSED FROM DESKTOP (CHECK SCREEN HEIGHT/WIDTH)
  // HERE IS SOME CODE FROM THE HACKATHON PROJECT WHICH SHOULD GET YOU A LOT OF THE WAY TO ADDING AND SAVING SHAPES ON DESKTOP
  // var drawnItems = new L.FeatureGroup();
  // map.addLayer(drawnItems);

  // // Initialise the draw control and pass it the FeatureGroup of editable layers
  // var drawControl = new L.Control.Draw({
  //   position: 'bottomleft',
  //   draw: {
  //     polygon: {
  //       shapeOptions: highlight
  //     },
  //     rectangle: {
  //       shapeOptions: highlight
  //     },
  //     polyline : false,
  //     circle : false,
  //     marker: false
  //   },
  //   edit: {
  //     featureGroup: drawnItems
  //   }
  // });
  // map.addControl(drawControl);

  // map.on('draw:created', function (e) {
  //     var type = e.layerType,
  //         layer = e.layer;

  //     // Add layer and listen for clicks
  //     map.addLayer(layer);
  //     drawnItems.addLayer(layer);
  //     layer.on('click', function(e) {
  //       //unhighlight old layer
  //       if (drawnItems._layers[selectedLayerId]) {
  //         drawnItems._layers[selectedLayerId].setStyle(defaultShape);
  //       }

  //       //switch selected layer to layer which has just been clicked
  //       selectedLayerId=e.target._leaflet_id;
        
  //       //highlight layer
  //       layer.setStyle(highlight);
  //     });

  //     //highlight and select layer
  //     if (drawnItems._layers[selectedLayerId]!==undefined) {
  //       drawnItems._layers[selectedLayerId].setStyle(defaultShape);
  //     }
  //     selectedLayerId=layer._leaflet_id;
  // });

  // map.on('draw:edited', function (e) {
  //     var layers = e.layers;
  //     selectedLayerId=undefined;
  // });

  // var findBoundaries=function(coordArr) {
  //   var boundaries={
  //     minLat: undefined,
  //     minLng: undefined,
  //     maxLat: undefined,
  //     maxLng: undefined
  //   };
  //   for (var c=0; c<coordArr.length; c++) {
  //     var coordinates=coordArr[c];
  //     if (coordinates.lat<boundaries.minLat || boundaries.minLat===undefined) {
  //       boundaries.minLat=coordinates.lat;
  //     }
  //     if (coordinates.lat>boundaries.maxLat || boundaries.maxLat===undefined) {
  //       boundaries.maxLat=coordinates.lat;
  //     }
  //     if (coordinates.lng<boundaries.minLng || boundaries.minLng===undefined) {
  //       boundaries.minLng=coordinates.lng;
  //     }
  //     if (coordinates.lng>boundaries.maxLng || boundaries.maxLng===undefined) {
  //       boundaries.maxLng=coordinates.lng;
  //     }
  //   }

  //   //set up check to limit boundaries to SF
  //   if (boundaries.minLat<37.7) {
  //     boundaries.minLat=37.7;
  //   }
  //   if (boundaries.maxLat>37.81) {
  //     boundaries.maxLat=37.81;
  //   }
  //   if (boundaries.minLng<-122.53) {
  //     boundaries.minLng=122.53;
  //   }
  //   if (boundaries.maxLng>-122.35) {
  //     boundaries.maxLng=-122.35
  //   }
  //   return boundaries;
  // };

  // var pointInPoly= function (point, polygon) {
  //   var convertToCoords=function(coordinates) {
  //     var coordArr=[];

  //     for (var i=0; i<coordinates.length; i++) {
  //       var coord=coordinates[i];
  //       var latLng=[coord['lat'], coord['lng']];
  //       coordArr.push(latLng);
  //     }
  //     return coordArr;
  //   };

  //   var vs=convertToCoords(polygon);
  //   var x = point[0], y = point[1];
    
  //   var inside = false;
  //   for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
  //     var xi = vs[i][0], yi = vs[i][1];
  //     var xj = vs[j][0], yj = vs[j][1];
      
  //     var intersect = ((yi > y) != (yj > y))
  //       && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
  //     if (intersect) inside = !inside;
  //   }
  //   return inside;
  // };







  //show current location every three seconds
  var here=undefined;
  map.locate({setView: true, maxZoom: 16});
  setInterval(function() {
    map.locate({setView: false, maxZoom: 16});
  }, 3000);

  var hereMarker=undefined;
  var onLocationFound = function (e) {
    var radius = 60;
    if (hereMarker===undefined) {
      hereMarker= new L.circle(e.latlng, radius, {color: '#03606B', weight: 2, opacity: .8});
      map.addLayer(hereMarker);
    } else {
      map.removeLayer(hereMarker);
      hereMarker=L.circle(e.latlng, radius, {color: '#03606B', weight: 2, opacity: .8});
      map.addLayer(hereMarker);
    }
    here=e.latlng;
  };

  map.on('locationfound', onLocationFound);

  var wait=undefined;
  var labels={};
  $scope.tag='';

  //clear all layers except for map which should be first layer
  $scope.clearMap=function(){
    var mapLayer=false;
    for (var layer in map._layers) {
      if (mapLayer===true) {
        map.removeLayer(map._layers[layer]);
      } else {
        mapLayer=true;
      }
    }
  }

  $scope.about=function(){
    $state.transitionTo('about');
  }

  //add tag to current location
  $scope.addHere=function(distance) {
    if ($scope.tag!=='') {
      var latlng=here.lat.toFixed(3) + ',' + here.lng.toFixed(3);

      labels[latlng] = labels[latlng] || [];
      labels[latlng].push(escape($scope.tag));

      //add circle to show location and add circle marker with zero radius so we can bind a label that is always visible
      new L.circle(here, distance, {color: '#DB5A55', weight: 2, opacity: .8}).addTo(map);
      L.circleMarker(here, {color: '#DB5A55', opacity: 0}).setRadius(0).bindLabel(($scope.tag), {noHide: true}).addTo(map);

      $scope.tag='';
      console.log(labels);

      //wait five seconds to save in case other tags are added
      if (wait===undefined) {
        wait=setTimeout(function() {
          $scope.saveTags();
          wait=undefined;
        }, 5000);
      } else {
        clearTimeout(wait);
        wait=setTimeout(function() {
          $scope.saveTags();
          wait=undefined;
        }, 5000);
      }
    }
  };

  //search through all users' tags
  $scope.searchTags=function() {
    $scope.clearMap();
    map.locate({setView: false, maxZoom: 16});

    if ($scope.tag!=='') {

      var request = new XMLHttpRequest();
      request.open('POST', '/home/search', true);
      request.setRequestHeader('Content-Type', 'application/json');
      request.onload = function() {
        var tags = JSON.parse(request.responseText);
        for (var tag in tags) {
          var latlng=tags[tag].coordinates.split(',');
          latlng[0]=parseFloat(latlng[0]);
          latlng[1]=parseFloat(latlng[1]);

          markerlng=latlng[1]-(block/3);

          //insert circle
          new L.circle(latlng, 40, {color: '#DB5A55', weight: 2, opacity: .8}).addTo(map);
          //insert circle marker so we can always show label
          var marker=L.circleMarker([latlng[0], markerlng], {color: '#DB5A55', opacity: 0}).setRadius(0).bindLabel(unescape(tags[tag].tag), {noHide: true}).addTo(map);   
        }
      };
      request.send(JSON.stringify(escape($scope.tag)));
      $scope.tag='';
    }
  };

  //send tags to server to be saved in database with user information
  $scope.saveTags=function() {
    //get all tags from page
    var tags = {};
    tags.coordinates = labels;
    tags.googleId = fbAuth.user.id;

    //send tags to server for saving
    var request = new XMLHttpRequest();
    request.open('POST', '/home', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify(tags));

    labels={};
  };

  //switch to community view which shows top tag for each lat-lng coorinate
  $scope.communitySwitch = function() {
    //switch colors for two buttons
    document.getElementById("personalMap").style.background='#F28D7A';
    document.getElementById("communityMap").style.background='#DB5A55';

    //turn off current location finder
    map.off('locationfound', onLocationFound);

    $scope.clearMap();

    //get tags from server, filtered to most popular
    request = new XMLHttpRequest();
    request.open('GET', '/home', true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400){
        // repopulate map with most popular tags
        var allCoords = JSON.parse(request.responseText);
        for (var coord in allCoords) {
          var latlng=allCoords[coord].coordinates.split(',');
          latlng[0]=parseFloat(latlng[0]);
          latlng[1]=parseFloat(latlng[1]);

          markerlng=latlng[1]-(block/3);

          //insert circle
          new L.circle(latlng, 40, {color: '#DB5A55', weight: 2, opacity: .8}).addTo(map);
          //insert circle marker so we can always show label
          var marker=L.circleMarker([latlng[0], markerlng], {color: '#DB5A55', opacity: 0}).setRadius(0).bindLabel(unescape(allCoords[coord].tag), {noHide: true}).addTo(map);   
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

    $scope.clearMap();

    //turn on current location finder
    map.on('locationfound', onLocationFound);
    map.locate({setView: false, maxZoom: 16});

    //make request for user tags
    var request = new XMLHttpRequest();
    request.open('POST', '/home/user', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function() {
      var tags = JSON.parse(request.responseText);
      for (var tag in tags) {
        var latlng=tags[tag].coordinates.split(',');
        latlng[0]=parseFloat(latlng[0]);
        latlng[1]=parseFloat(latlng[1]);

        markerlng=latlng[1]-(block/3);

        //insert circle
        new L.circle(latlng, 40, {color: '#DB5A55', weight: 2, opacity: .8}).addTo(map);
        //insert circle marker so we can always show label
        var marker=L.circleMarker([latlng[0], markerlng], {color: '#DB5A55', opacity: 0}).setRadius(0).bindLabel(unescape(tags[tag].tag), {noHide: true}).addTo(map);   
      }

    };
    request.send(JSON.stringify(fbAuth.user.id));
  };

  // perform initial load of user's personal tags
  $scope.personalSwitch();
});


