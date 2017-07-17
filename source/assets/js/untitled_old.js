$(function() {
  //see if cookie exists, and if so load it
  var cookie = Cookies.get('template');
  if(cookie) {
    $('.Code--template code').html(cookie);
    $('.Clipboard').removeClass('disabled');
  }

  var myDropzone = new Dropzone("#Drop_zone", {
    url: "#",
    uploadMultiple: true,
    addRemoveLinks: true,
    previewsContainer: "#Photos",
    clickable: false,
    thumbnailWidth:"250",
    thumbnailHeight:"250",
    maxFiles: 4,
    maxfilesexceeded: function(file){
      alert('There is a maximum of 4 images');
      this.removeFile(file);
    },
    removedfile: function(file) {
      filterCheck();
      var _ref;
      if (file.previewElement) {
        if ((_ref = file.previewElement) != null) {
          _ref.parentNode.removeChild(file.previewElement);
        }
      }
      return this._updateMaxFilesReachedClass();
    },
    accept: function(file, done) {done()}
  });

  var sortable, imgCount;

  function filterCheck(){
    $(".Code code").html('');
    $('.Options div').addClass('disabled');

    $('#Drop_zone').css('background-image', 'url()');
    $('input').prop('checked', false);

    imgCount = myDropzone.files.length;

    if(imgCount == 1) {
      $('.show_one').removeClass('disabled');
      $('.Options div:not(.show_one)').addClass('disabled');
    } else if (imgCount == 2) {
      $('.show_two').removeClass('disabled');
      $('.Options div:not(.show_two)').addClass('disabled');
    } else if (imgCount == 3) {
      $('.show_three').removeClass('disabled');
      $('.Options div:not(.show_three)').addClass('disabled');
    } else if (imgCount == 4) {
      $('.show_four').removeClass('disabled');
      $('.Options div:not(.show_four)').addClass('disabled');
    }
  }

  myDropzone.on("complete", function(file) {
    filterCheck();

    sortable = Sortable.create(Photos, {
      animation: 150
    });

    $('.Caption').fadeIn(300);
  });

  $('.Options div > input').change(function(){

    $(".Code code").html('');
    $(".Output .Info").removeClass('disabled');

    if($(this).closest('.Panel').hasClass('Filter--photo')) {
      var output = $(sortable.el),
       files = [],
       caption_value = $('.Caption').val();

     if (caption_value) {
      var caption_string = ", :caption => " + '"' + caption_value + '"'
     } else {
      var caption_string = "";
     }



      output.find('.dz-preview').each(function(){
        var fileName = $(this).find('.dz-filename').text();
        files.push(fileName);
      });

      // ONE IMAGE LAYOUT CHOSEN
      if($(this).parent().hasClass('show_one')){
        if($(this).is('#one_up')){
          $(".Code code").append('<span class="Code--wrap">' + '<%= partial(:full, :locals => { :image_one => folder + "/' + files[0] + '"' + caption_string + '}) %></span>');
        } else if($(this).is('#full_one')){
          $(".Code code").append('<span class="Code--wrap">' + '<%= partial(:full_bleed, :locals => { :image_one => folder + "/' + files[0] + '"' + caption_string + '}) %></span>');
        }
      }
      // TWO IMAGES LAYOUT CHOSEN
      if($(this).parent().hasClass('show_two')){
        if($(this).is('#two_up')){
          $(".Code code").append('<span class="Code--wrap">' + '<%= partial(:half, :locals => { :image_one => folder + "/' + files[0] +  '", :image_two => folder + "/' + files[1] + '"' + caption_string + '}) %></span>');
        } else if($(this).is('#full_two')){
          $(".Code code").append('<span class="Code--wrap">' + '<%= partial(:full_bleed_split, :locals => { :image_one => folder + "/' + files[0] +  '", :image_two => folder + "/' + files[1] + '"' + caption_string + '}) %></span>');
        } else if($(this).is('#two_up_right')){
          $(".Code code").append('<span class="Code--wrap">' + '<%= partial(:half_heavy, :locals => { :heavy_side => "right", :image_one => folder + "/' + files[0] +  '", :image_two => folder + "/' + files[1] + '"' + caption_string + '}) %></span>');
        } else if($(this).is('#two_up_left')){
          $(".Code code").append('<span class="Code--wrap">' + '<%= partial(:half_heavy, :locals => { :heavy_side => "left", :image_one => folder + "/' + files[0] +  '", :image_two => folder + "/' + files[1] + '"' + caption_string + '}) %></span>');
        }
      }
      // THREE IMAGES LAYOUT CHOSEN
      if($(this).is('#three_up')){
        $(".Code code").append('<span class="Code--wrap">' + '<%= partial(:triplet, :locals => { :image_one => folder + "/' + files[0] +  '", :image_two => folder + "/' + files[1] +  '", :image_three => folder + "/' + files[2] + '"' + caption_string + '}) %></span>');
      }
      // FOUR IMAGES LAYOUT CHOSEN
      if($(this).is('#four_up')){
        $(".Code code").append('<span class="Code--wrap">' + '<%= partial(:quad, :locals => { :image_one => folder + "/' + files[0] +  '", :image_two => folder + "/' + files[1] +  '", :image_three => folder + "/' + files[2] +  '", :image_four => folder + "/' + files[3] + '"' + caption_string + '}) %></span>');
      }
    } else {
      //text stuff
      var entry = $('.Text--wrap textarea').val();

      if (entry.length) {
        console.log ('text selected: ' + entry)
        if($(this).is('#header')){
          $(".Code code").append('<span class="Code--wrap">' + '<%= partial(:headline, :locals => { :copy => "' + entry + '" }) %></span>');
        } else if($(this).is('#subheader')){
          $(".Code code").append('<span class="Code--wrap">' + '<%= partial(:subheader, :locals => { :copy => "' + entry + '" }) %></span>');
        } else if($(this).is('#one_col')){
          $(".Code code").append('<span class="Code--wrap">' + '<%= partial(:text_one_col, :locals => { :copy => "' + entry + '" }) %></span>');
        } else if($(this).is('#two_col')){
          $(".Code code").append('<span class="Code--wrap">' + '<%= partial(:text_two_col, :locals => { :col_one_copy => "' + split[0] + '", :col_two_copy =>  "' + split[1] + '"}) %></span>');
        }

      } else {
        console.log ('you must first type before selecting a layout')
      }
    }

    //highilight it
    $('.Code code').each(function(i, block) {
      hljs.highlightBlock(block);
    });

  });


   // $('.Filter--text div > input').change(function(){

   //  alert('sdfsdf')
   // });

  // add to template
  $('.Output .Info').on('click', function(){
    var output = $('.Code').text();
    $(".Code--template code").append("<span class='Code--wrap'>" + output + "</span>");

    //highilight it
    $('.Code--template').each(function(i, block) {
      hljs.highlightBlock(block);
    });

    $(".Template .Info").removeClass('disabled');
    $(this).addClass('disabled');

    //remove all iamges from drop zone
    myDropzone.removeAllFiles(true);

    if($('.add_photos').hasClass('active')) {
      $('#Drop_zone').css('background-image', 'url(/assets/images/generator/upload.png)');
    }
    $('.Caption').hide();

    //cookie setting
    var new_output = $('.Code--template code').html();
    Cookies.set('template', new_output);
  });


  //copy to clipboard
  function copyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = 0;
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      console.log('Copying text command was ' + msg);
    } catch (err) {
      console.log('Oops, unable to copy');
    }
    document.body.removeChild(textArea);
  }

  // copy to clipboard
  $('.Clipboard').on('click', function(){
    var code_copy = $('.Code--template').text();
    copyTextToClipboard(code_copy);
    $('.Clipboard--feedback').fadeIn(200);

    setTimeout(function(){
      $('.Clipboard--feedback').fadeOut(2000);
    }, 500)
  });

  $('.Clear').on('click', function(){
    Cookies.remove('template');

    $('.Code--template code').html('');
    $(".Clipboard").addClass('disabled');
  });


  //tabs

  $('.add_text').on('click', function(){
    $('.Filter--photo').addClass('is-hidden');
    $('.Filter--text').removeClass('is-hidden');

    $('.add_photos').removeClass('active')
    $(this).addClass('active');

    $('#Drop_zone').css('background-image', 'none');

    $('.Photos--wrap').fadeOut(300);
    $('.Text--wrap').fadeIn(300);
    $('input').prop('checked', false);

    $('textarea').focus();
  });


  $('.add_photos').on('click', function(){
    $('.Filter--photo').removeClass('is-hidden');
    $('.Filter--text').addClass('is-hidden');

    $('.add_text').removeClass('active')
    $(this).addClass('active');

    $('.Photos--wrap').fadeIn(300);
    $('.Text--wrap').fadeOut(100);
    $('input').prop('checked', false);

    if( $('#Photos').is(':empty') ) {
      $('#Drop_zone').css('background-image', 'url(/assets/images/generator/upload.png)');
    }

  });

  var split;

  $('textarea').on('keyup', function(e){
    var typed = $('textarea').val();

    split = typed.match(/[^\r\n]+/g);

    if(typed.length < 2) {
      $('.header, .subheader, .one_col, .two_col').addClass('disabled');
    } else if(typed.length > 1) {
      $('.header, .subheader').removeClass('disabled');
    }
    if(typed.length > 10) {
      $('.one_col').removeClass('disabled');
    }

    if(split[1]){
      $('.two_col').removeClass('disabled');
    } else {
      $('.two_col').addClass('disabled');
    }

    if(typed.length < 10) {
      $('.one_col').addClass('disabled');
    }
  });
});
