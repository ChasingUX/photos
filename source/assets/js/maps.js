$(function() {
  if($('body').hasClass('index')){

    $(".voyages li a").on('click', function(){
      $(".voyages li a").not(this).each(function(){
        if($(this).hasClass('border')){
          $(this).toggleClass('border');
          $(this).next('.stops').toggleClass('open');
          $(this).parent('li').toggleClass('expanded');
        }
      })
      $(this).toggleClass('border');
      $(this).parent('li').toggleClass('expanded');
      $(this).next('.stops').toggleClass('open');
    })

    mapboxgl.accessToken = 'pk.eyJ1IjoiamJpcmQxMTExIiwiYSI6ImNpazVwYzdhNzAwN3BpZm0yZHhhOWp6c3IifQ.6EQjuObxFgOTrafXG9Juig';
    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/jbird1111/cjg5rz0rf7kgj2soc21nvsgib',
      center: [55,10],
      zoom: 2.4
    });

    function getLatLng(){
      var lat = map.getCenter().lat,
      lng = map.getCenter().lng,
      LatLong = [lng, lat];

      return LatLong;
    }

    //capitalize first letters and replace underscores with spaces
    function humanize(str) {
      var frags = str.split('_');
      for (i=0; i<frags.length; i++) {
        frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
      }
      return frags.join(' ');
    }



    function fly(feature, speed){
      map.flyTo({
        center: feature.geometry.coordinates,
        speed: speed,
        curve: 1.2,
        zoom: 5,
      });
    }

    function tooltip(feature){
      var location = feature.properties.name,
        flag = feature.properties.flag;

      if (flag === undefined) {
        var html = '<h3>' + location + '</h3>',
          story ='';
      } else {
        var country = humanize(flag);
          date = feature.properties.date,
          html = '<h3>' + location + '</h3><span class="flag flag-' + flag + '"></span><p>' + country + ' · ' + date +'</p>',
          story ='';
      }

      if(feature.layer.id == 'travel-stories'){
        story = '<a href="/voyage/' + feature.properties.story_url + '/">Read the ' + feature.properties.name + ' story</a>';
      }

      var popup = new mapboxgl.Popup({ offset: [0, -20] })
        .setLngLat(feature.geometry.coordinates)
        .setHTML(html + story)
        .setLngLat(feature.geometry.coordinates)
        .addTo(map);
    }

    //show cursors when hovering over a marker
    map.on('mousemove', function (e) {
      var features = map.queryRenderedFeatures(e.point),
          feature = features[0];

      if(typeof feature !== "undefined"){
        if(feature.layer.id == "travels" || feature.layer.id == "travel-stories"){
          map.getCanvas().style.cursor = 'pointer';
        } else {
          map.getCanvas().style.cursor = '';
        }
      }
    });

    // when we click on a marker
    map.on('click', function(e) {
      var oldCenter = getLatLng(),
        features = map.queryRenderedFeatures(e.point, {
          layers: ['travels', 'travel-stories']
        }),
        feature = features[0];

      if (!features.length) {
        return;
      }

      var from = turf.point(oldCenter),
       to = turf.point(feature.geometry.coordinates),
       options = {units: 'miles'},
       distance = turf.distance(from, to),
       speed;

      if (distance < 10000 && distance > 5000) {
        speed = 1;
      } else if (distance < 5000 && distance > 4000) {
        speed = .7;
      } else if (distance < 4000 && distance > 3000) {
        speed = .5;
      } else if (distance < 3000 && distance > 2000) {
        speed = .3;
      } else if (distance < 2000 && distance > 1000) {
        speed = .2;
      } else {
        speed = .2;
      }
      console.log("Distance is: " + distance);
      console.log("Speed is: " + speed);

      if (distance > 1000) {
        fly(feature, speed)
      }

      map.on('moveend', function(e){
        tooltip(feature)
      });
    });
  }
});
