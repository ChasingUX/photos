$(function() {

  const player = Plyr.setup('.videos',{
    captions: {active: false},
    controls: ['play-large', 'play', 'progress', 'mute', 'fullscreen']
  });

  const audioPlayer = Plyr.setup('.audio',{
    controls: ['play-large', 'play', 'progress', 'mute']
  });

  window.player = player;

  var galleryOptions= {
    thumbnail: false,
    counter: true,
    download: false,
    fullScreen: false,
    getCaptionFromTitleOrAlt: false,
    selector: '.img_wrap'
  }

  var $gallery = $('#Gallery--wrap');
  $gallery.lightGallery(galleryOptions);

  $(".img_wrap img").unveil(300, function() {

    console.log('unveiled')
    var $thisImage = $(this),
    thisParent = $(this).parent();

    $thisImage.load(function() {
      $(thisParent).addClass('is-visible');
      $gallery.data('lightGallery').destroy(true);
      $gallery.lightGallery(galleryOptions);
    });

    Waypoint.refreshAll();
  });

  // WAYPOINTS
  var offset = 120;

  var waypoints = $('#Gallery--wrap section').waypoint({
    handler: function(direction) {
      var justPassed = $(this.element),
        thisID = '#' + this.element.id,
        firstWaypoint = $("#Gallery--wrap section").first(),
        title;

      $(".sticky").addClass('is-visible');

      if(justPassed.hasClass('sectionTitle')) {
        $("#Chapter_dropdown a").each(function(){
          if($(this).attr('href') == thisID){
            $("#Chapter_dropdown li").removeClass('active');
            $(this).parent('li').addClass('active');
          }
        })

        if(justPassed.hasClass('Subheader')) {
          title = justPassed.find('h3').text();
        } else if(justPassed.hasClass('Headline')){
          title = justPassed.find('h2').text();
        }

        $(".sticky h3 span").addClass("is-visible");
        $(".sticky h3 span").text(title)
      }

      if(justPassed[0] == firstWaypoint[0]) {
        if(direction == 'up') {
          $(".sticky").removeClass('is-visible');
          $(".Dropdown").removeClass("is-visible");
        }
      }
    },
    offset: offset
  })

  var chapterCount = $(".sectionTitle").length;
  $(".count a").text(chapterCount);


  var titles = [];

  $(".sectionTitle").each(function(){
    var id = $(this).attr('id'),
    title = $(this).find('h3,h2').text();

    titles.push("<a href='#" + id + "'>" + title + "</a>");
  });



  var titlesLength = titles.length;

  for (var i = 0; i < titlesLength; i++) {
      $("#Chapter_dropdown ul").append("<li>"+ titles[i] +"</li>");
  }


  $(".count a").on('click', function(event){
    $("#Chapter_dropdown").toggleClass("is-visible");
    event.preventDefault();
  });

  $(".back").on('click', function(event){
    $("#Stories_dropdown").toggleClass("is-visible");
    event.preventDefault();
  })


  //collapse dropdoiwn if clicked outside of it
  $('body').click(function(e) {
    if($(e.target).parents('#Chapter_dropdown').length == 0) {
      if($(e.target).parents('.count').length == 0) {
        $("#Chapter_dropdown").removeClass("is-visible");
      }
    }

    if($(e.target).parents('#Chapter_Stories').length == 0) {
      if($(e.target).parents('.back').length == 0) {
        $("#Stories_dropdown").removeClass("is-visible");
      }
    }
  });

  //scroll to correct area from dropdown
  $('#Chapter_dropdown a[href*="#"]').click(function(event) {
    if (
      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
      &&
      location.hostname == this.hostname
    ) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        event.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top - offset
        }, 800, function() {
          var $target = $(target);
          $target.focus();
          if ($target.is(":focus")) {
            return false;
          } else {
            $target.attr('tabindex','-1');
            $target.focus();
          };
        });
      }
    }
  });
});
