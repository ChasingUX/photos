$(function() {
  if($('body').hasClass('index')){

    var defaultZoom = 1.4;
    var mapLoaded = false;
    var countries;
    var cities;
    var popup;
    var countryDictionary = [];
    var cityDictionary = [];
    var startingPoint = [10,20];
    var oldCenter;
    var chromeHeight = $('.chrome').outerHeight(true);
    var popupOffsets = {
     'top': [0, 24],
     'bottom': [0, -24]
    };

    mapboxgl.accessToken = 'pk.eyJ1IjoiamJpcmQxMTExIiwiYSI6ImNpazVwYzdhNzAwN3BpZm0yZHhhOWp6c3IifQ.6EQjuObxFgOTrafXG9Juig';

    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/jbird1111/cjg5rz0rf7kgj2soc21nvsgib',
      center: startingPoint,
      zoom: defaultZoom,
      minZoom: defaultZoom
    });

    var nav = new mapboxgl.NavigationControl({
      showCompass: false
    });

    map.addControl(nav, 'top-right');
    map.on('load', onMapLoad)

    function onMapLoad(){
      console.log('map data loaded')
      mapLoaded = true;

      countries = map.querySourceFeatures('composite', {sourceLayer: 'Countries'})
      cities = map.querySourceFeatures('composite', {sourceLayer: 'Travels'})

      $.each(countries, function (e) {
        var countryName = this.properties.name,
            countryCoords = this.geometry.coordinates;

        countryDictionary.push({
          key:   countryName,
          value: countryCoords
        });
      });

      $.each(cities, function (e) {
        var cityName = this.properties.name,
            cityCoords = this.geometry.coordinates;

        cityDictionary.push({
          key:   cityName,
          value: cityCoords
        });
      });
    }

    function flyToClickedLocation(location) {
      oldCenter = getLatLng();

      var coordinates,
          zoom,
          matchFound = false;

      if(location =='Japan'){
        var zoom = 5.5;
      } else if(location =='USA'){
        zoom = 3.5;
      } else if(location =='Thailand'){
        zoom = 4.5;
      } else if(location =='Israel'){
        zoom = 6;
      } else if(location =='Singapore'){
        zoom = 9;
      } else {
        zoom = 5;
      }

      $.each(countryDictionary, function (e) {
        if(this.key == location) {
          matchFound = true;
          coordinates = this.value;
        }
      })

      if(matchFound = true) {
        flySpeedBasedOnDistance(oldCenter, coordinates, zoom)
      }
    }

    function collapseOthers(justChosen){
       // go through all the items that are not clicked, and if expanded, collapse
      $(".voyages li a").not(justChosen).each(function(){
        if($(this).hasClass('border')){
          $(this).toggleClass('border');
          $('.stops').toggleClass('open');
          $('.stops .open').toggleClass('open');
          $(this).parent('li').toggleClass('expanded');
          $('.mapWrap').toggleClass('panel_open');
        }
      })
    }

    function expandSelected(target){
      var targetObj = $(target);

      targetObj.toggleClass('border');
      targetObj.parent('li').toggleClass('expanded');

      var clickedClasses = targetObj.parent().attr('class'),
          clickedCountry = clickedClasses.replace(' expanded','');

      $('.stops').toggleClass('open');
      $('.stops h3 span').text(humanize(clickedCountry));
      $('.stops').find('.' + clickedCountry).toggleClass('open');
      $('.mapWrap').toggleClass('panel_open');

      if ($(window).width() < 581) {
        $('html, body').animate({
          scrollTop: $(".stops").offset().top
        }, 600);
      }
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

    function tooltip(feature){
      if(typeof popup !== "undefined"){
        popup.remove();
      }

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

      popup = new mapboxgl.Popup({offset: popupOffsets})
        .setLngLat(feature.geometry.coordinates)
        .setHTML(html + story)
        .addTo(map);
    }

    function highlightCityFromMap(feature){
      //highlight the specific location in the panel for a moment
      var location = feature.properties.name.replace(/ /g,"_").replace(/\./g, '').toLowerCase();

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

    function fly(coordinates, speed, zoom){
      map.flyTo({
        center: coordinates,
        speed: speed,
        curve: 1.2,
        zoom: zoom,
      });
    }

    function flySpeedBasedOnDistance(oldCenter, coordinates, zoom){
      var from = turf.point(oldCenter),
       to = turf.point(coordinates),
       options = {units: 'miles'},
       distance = turf.distance(from, to),
       speed;

      if (distance < 100000 && distance > 5000) {
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
      console.log("Zoom is: " + zoom);

      fly(coordinates, speed, zoom);
    }

    function backToDefault(){
      oldCenter = getLatLng();

      if(typeof popup !== "undefined"){
        popup.remove();
      }

      flySpeedBasedOnDistance(oldCenter, startingPoint, defaultZoom)
      removeHighlightedCity();
      collapseOthers();
    }

    // when we click on menu, expend item, collapse others
    $(".voyages li a").on('click', function(e){
      var location = $(this).find('h3').text();

      if(typeof popup !== "undefined"){
        popup.remove();
      }

      collapseOthers(this);
      expandSelected(this);
      flyToClickedLocation(location);

      e.preventDefault();
    });

    $('.stops ul li').mouseover(function() {

      // if(typeof popup !== "undefined"){
      //   popup.remove();
      // }

      // popup = new mapboxgl.Popup({offset: popupOffsets})
      //   .setLngLat(feature.geometry.coordinates)
      //   .setHTML(html + story)
      //   .addTo(map);
    });

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
      var zoom = 7;
      oldCenter = getLatLng();

      removeHighlightedCity();

      var features = map.queryRenderedFeatures(e.point, {
        layers: ['travels']
      }),
      feature = features[0];

      if(typeof feature !== "undefined") {
        var coordinates = feature.geometry.coordinates;

        //disable scroll
        map.scrollZoom.disable();

        expandPanelFromMarker(feature);
        flySpeedBasedOnDistance(oldCenter, coordinates, zoom)
        tooltip(feature)
      }

      // when zooming has ended
      map.once('moveend', function(e){
        //turn scrolling back on
        map.scrollZoom.enable();
      });
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
