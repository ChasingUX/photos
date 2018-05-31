$(function() {
  if($('body').hasClass('index')){

    mapboxgl.accessToken = 'pk.eyJ1IjoiamJpcmQxMTExIiwiYSI6ImNpazVwYzdhNzAwN3BpZm0yZHhhOWp6c3IifQ.6EQjuObxFgOTrafXG9Juig';
    var startingPoint = [55,10];
    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/jbird1111/cjg5rz0rf7kgj2soc21nvsgib',
      center: startingPoint,
      zoom: 2.4
    });

    var nav = new mapboxgl.NavigationControl({
      showCompass: false
    });

    map.addControl(nav, 'top-right');

    var popup = new mapboxgl.Popup({ offset: [0, -20] })
    var oldCenter;

    function collapseOthers(justChosen){
       // go through all the items that are not clicked, and if expanded, collapse
      $(".voyages li a").not(justChosen).each(function(){
        if($(this).hasClass('border')){
          $(this).toggleClass('border');
          $(this).next('.stops').toggleClass('open');
          $(this).parent('li').toggleClass('expanded');
        }
      })
    }

    function expandSelected(target){
      var targetObj = $(target);

      targetObj.toggleClass('border');
      targetObj.parent('li').toggleClass('expanded');
      targetObj.next('.stops').toggleClass('open');
    }

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
        zoom: 7,
      });
    }

    function tooltip(feature){
      popup.remove();

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
        story = '<div><a href="/voyage/' + feature.properties.story_url + '/">Read the ' + feature.properties.name + ' story</a></div>';
      } else {
        story = '<div>The ' + feature.properties.name + ' story is coming soon!</div>'
      }

      popup.setLngLat(feature.geometry.coordinates)
        .setHTML(html + story)
        .setLngLat(feature.geometry.coordinates)
        .addTo(map);
    }

    function highlightCityFromMap(feature){
      //highlight the specific location in the panel for a moment
      var location = feature.properties.name.replace(/ /g,"_").replace(/\./g, '').toLowerCase();
      console.log("name: " + location)

      $(".voyages .expanded li").each(function(){
        var thisClass = $(this).attr('class');

        if (thisClass == location) {
          $(this).addClass('match')
        }
      });
    }

    function removeHighlightedCity(){
      $(".match").removeClass('match');
    }

    function expandPanelFromMarker(feature){
       //expand in panel
      var countryLowerCase = humanize(feature.properties.flag).toLowerCase(),
        parentElement = $('.' + countryLowerCase + '')
        anchorElement = $('.' + countryLowerCase + ' a')

      collapseOthers(anchorElement);

      // check to see if element is already open. if it isnt, then perform expansion.
      if(!parentElement.hasClass('expanded')){
        expandSelected(anchorElement);
      }

      highlightCityFromMap(feature);
    }

    function flySpeedBasedOnDistance(oldCenter, feature){
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
        speed = .45;
      } else if (distance < 2000 && distance > 1000) {
        speed = .4;
      } else if (distance < 1000) {
        speed = .3;
      }

      console.log("Distance is: " + distance);
      console.log("Speed is: " + speed);

      fly(feature, speed);
    }

    function backToDefault(){
      map.flyTo({
        center: startingPoint,
        speed: .5,
        zoom: 2.4,
      });

      removeHighlightedCity();
      popup.remove();

      collapseOthers();
    }

    // when we click on menu, expend item, collapse others
    $(".voyages li a").on('click', function(){
      collapseOthers(this);
      expandSelected(this);
    })

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
      oldCenter = getLatLng();
      //popup.remove();
      removeHighlightedCity();

      var features = map.queryRenderedFeatures(e.point, {
        layers: ['travels', 'travel-stories']
      }),
      feature = features[0];

      if (!features.length) {
        return;
      }

      expandPanelFromMarker(feature);
      flySpeedBasedOnDistance(oldCenter, feature)
      tooltip(feature)

      // at the end of the zoom, show the tooltip
      // map.once('moveend', function(e){
      //   tooltip(feature)
      // });
    });

    //when a map is done moving or zooming, store the center point
    map.on('moveend', function(e){
       oldCenter = getLatLng();
    });

    $(".back").on('click', function(){
      backToDefault();
    })
  }
});
