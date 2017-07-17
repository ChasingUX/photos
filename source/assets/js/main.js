$(function() {
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
    var $thisImage = $(this),
    thisParent = $(this).parent();

    $thisImage.load(function() {
      $(thisParent).addClass('is-visible');
      $gallery.data('lightGallery').destroy(true);
      $gallery.lightGallery(galleryOptions);
    });
  });

  // WAYPOINTS
  var waypoints = $('#Gallery--wrap section').waypoint({
    handler: function(direction) {
      var justPassed = $(this.element),
        firstWaypoint = $("#Gallery--wrap section").first(),
        title;

      $(".sticky").addClass('is-visible');

      if(justPassed.hasClass('sectionTitle')) {

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
        }
      }
    },
    offset: 120
  })

  // header waypoint - to remove banner
  var docHeight = - $(window).height() - 20;
  var waypoint = new Waypoint({
    element: document.getElementById('Header'),
    handler: function(direction) {
      if(direction == 'up') {
        $(".sticky").removeClass('is-visible');
      }
    },
    offset: docHeight
  })
});
