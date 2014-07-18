var app = angular.module('microhoods.home', [])
.controller('map-controller', function($scope, $window, fbAuth) {
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

  var height=$window.document.body.scrollHeight*.90;
  $window.document.getElementById("map").style.height=height.toString()+'px'
  var topPos=$window.document.body.scrollHeight*.05;
  $window.document.getElementById("map").style.top=topPos.toString()+'px'

  //initialize map to SF
  var map = L.map('map', {zoomControl: false, attributionControl: false, maxBounds: [[37.7, -122.65], [37.85, -122.3]], minZoom: 12}).setView([37.789, -122.414], 14);

  L.tileLayer('http://api.tiles.mapbox.com/v3/austentalbot.gfeh9hg8/{z}/{x}/{y}.png', {maxZoom: 18}).addTo(map);

  //zoom to current location
  var here=undefined;
  map.locate({setView: true, maxZoom: 16});
  setInterval(function() {
    map.locate({setView: false, maxZoom: 16});
  }, 5000);

  var hereMarker=undefined;
  var onLocationFound = function (e) {
    // console.log(e);
    var radius = 100;
    // console.log(hereMarker);
    if (hereMarker===undefined) {
      hereMarker= new L.circle(e.latlng, radius, {color: '#03606B', weight: 2, opacity: .8});
      map.addLayer(hereMarker);
    } else {
      map.removeLayer(hereMarker);
      hereMarker=L.circle(e.latlng, radius, {color: '#03606B', weight: 2, opacity: .8});
      map.addLayer(hereMarker);
    }
    here=e.latlng;
    // console.log(here.lat.toFixed(3) + here.lng.toFixed(3));
  };

  map.on('locationfound', onLocationFound);

  var createTags=function() {
    var allTags={};
    for (var coordStr in labels) {
      console.log(labels[coordStr]);
      var coords=coordStr.split(',');
      coords[0]=parseInt(coords[0].replace(/\./g, ''));
      coords[1]=parseInt(coords[1].replace(/\./g, ''));

      // console.log(coords);
      for (var i=coords[0]-1; i<=coords[0]+1; i++) {
        var iStr=i.toString()
        for (var j=coords[1]-1; j<=coords[1]+1; j++) {
          var jStr=j.toString()
          var point=iStr.substring(0, iStr.length-3)+'.'+iStr.substring(iStr.length-3)+','+jStr.substring(0, jStr.length-3)+'.'+jStr.substring(jStr.length-3);
          allTags[point]=allTags[point] || [];
          allTags[point]=allTags[point].concat(labels[coordStr])
        }
      }
    }

    return allTags;
  }

  var wait=undefined;
  var labels={};
  $scope.tag='';
  $scope.addHere=function(distance) {
    if ($scope.tag!=='') {
      // console.log('here:');
      // console.log(here);
      var latlng=here.lat.toFixed(3) + ',' + here.lng.toFixed(3);

      labels[latlng] = labels[latlng] || [];
      console.dir(labels);
      labels[latlng].push($scope.tag);
      // console.log(labels);

      new L.circle(here, distance, {color: '#DB5A55', weight: 2, opacity: .8}).addTo(map);
      L.circleMarker(here, {color: '#DB5A55', opacity: 0}).setRadius(0).bindLabel($scope.tag, {noHide: true}).addTo(map);

      $scope.tag='';

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
  }

  $scope.searchTags=function() {
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
          var marker=L.circleMarker([latlng[0], markerlng], {color: '#DB5A55', opacity: 0}).setRadius(0).bindLabel(tags[tag].tag, {noHide: true}).addTo(map);   
        }


      };
      request.send(JSON.stringify($scope.tag));
      console.log('searching for:', $scope.tag)
      $scope.tag='';
    }
  }

  $scope.saveTags=function() {
    //get all tags from page
    var tags = {};
    tags.coordinates = createTags();
    tags.googleId = fbAuth.user.id;
    console.log('saving');
    console.log(tags);

    //send tags to server for saving
    var request = new XMLHttpRequest();
    request.open('POST', '/home', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify(tags));
    console.log(request);

    labels={};
  };

  $scope.communitySwitch = function() {
    //switch colors for two buttons
    document.getElementById("personalMap").style.background='#F28D7A';
    document.getElementById("communityMap").style.background='#DB5A55';

    //turn off current location finder
    map.off('locationfound', onLocationFound);

    //clear all layers
    for (var layer in map._layers) {

      if (layer!=='15') {
        map.removeLayer(map._layers[layer]);
      }
    }

    //get tags from server, filtered to most popular
    request = new XMLHttpRequest();
    request.open('GET', '/home', true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400){
        // repopulate map with most popular tags
        var allCoords = JSON.parse(request.responseText);
        console.log(allCoords);
        for (var coord in allCoords) {
          console.log(allCoords[coord]);
          var latlng=allCoords[coord].coordinates.split(',');
          latlng[0]=parseFloat(latlng[0]);
          latlng[1]=parseFloat(latlng[1]);

          markerlng=latlng[1]-(block/3);

          //insert circle
          new L.circle(latlng, 40, {color: '#DB5A55', weight: 2, opacity: .8}).addTo(map);
          //insert circle marker so we can always show label
          var marker=L.circleMarker([latlng[0], markerlng], {color: '#DB5A55', opacity: 0}).setRadius(0).bindLabel(allCoords[coord].tag, {noHide: true}).addTo(map);   

        //   if (coord!=='undefined') {
        //     var label=allCoords[coord]['label'];
        //     var sent=allCoords[coord]['sentiment'];
        //   }
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
  };
});


