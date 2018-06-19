var protocol = window.location.protocol,
    currentURL = window.location.href;
    var getURL = window.location;
    var domain = getURL .protocol + "//" + getURL.host + "/" + getURL.pathname.split('/')[1];

// URL Param function
function urlParam(name) {
    url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

  // Wait for everything to load before removing grey fill

  var loaded = false;

  window.onload = function () {
     loaded = true;
     $('.loading-screen').fadeOut('slow');
  }

  setTimeout(function() {
    if (loaded == false) {
      $('.loading-screen').fadeOut('slow');
    }
  }, 400);

$(document).ready(function() {

  // Facebook Share
  $.ajaxSetup({ cache: true });
  $.getScript('https://connect.facebook.net/en_US/sdk.js', function(){
    FB.init({
      appId: '405308629935609',
      version: 'v2.7' // or v2.1, v2.2, v2.3, ...
    });
    $('#loginbutton,#feedbutton').removeAttr('disabled');

  });

  $('#facebook').click(function() {
    FB.ui({
      method: 'share',
      href: currentURL,
    }, function(response){});
  })

  // Mobile menu

  $('#mobile-menu').click (function(){
			$('.pull-out-drawer').toggleClass('active');
      $('body').addClass('fix');
			$('#close-drawer').click(function() {
        $('.pull-out-drawer').removeClass('active');
        $('body').removeClass('fix');
      })
		});

   $(".menu-item-has-children").one("click", false, function(e){
     e.preventDefault();
     $(this).toggleClass('active');
   })



})
