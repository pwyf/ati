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

// Parse JSON for use
var agencies = (function() {
      var agencies = null;
      $.ajax({
          'async': false,
          'global': false,
          'url': domain + "/old-results.json",
          'dataType': "json",
          'success': function (data) {
              agencies = data;
          }
      });
      return agencies;
  })();


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

  var componentTotals = [15, 25, 20, 20, 20];


  // Comparison Agencies
  var usAgencies = ['us-usaid', 'us-mcc', 'us-state', 'us-pepfar', 'us-defense'];
  var euAgencies = ['belgium-dgcd', 'denmark-mfa', 'ebrd', 'ec-devco', 'ec-echo', 'ec-near', 'finland-mfa', 'france-afd', 'france-meae', 'ireland-irishaid', 'italy-mae', 'netherlands-mfa', 'spain-maec-aecid', 'sweden-mfa-sida', 'uk-dfid'];
  var dfiAgencies = ['afdb', 'asdb', 'ebrd','iadb', 'world-bank-ida', 'world-bank-ifc'];
  var unAgencies = ['unicef', 'undp', 'un-ocha'];
  var bilateralAgencies = ['uk-dfid', 'uk-fco', 'sweden-mfa-sida', 'canada-dfatd', 'netherlands-mfa','us-usaid', 'us-mcc', 'us-state', 'us-pepfar', 'us-defense', 'germany-bmz-giz', 'germany-bmz-kfw', 'switzerland-sdc', 'australia-dfat', 'denmark-mfa','france-afd', 'france-meae', 'italy-mae', 'finland-mfa', 'belgium-dgcd', 'japan-jica', 'ireland-irishaid', 'spain-maec-aecid', 'norway-mfa', 'korea-koica', 'new-zealand-mfat', 'uae-ministry-of-foreign-affairs', 'china-mofcom'];
  var comparisonAgencies = {usAgencies, unAgencies, euAgencies, dfiAgencies};

$(document).ready(function() {

  // Facebook Share
  $.ajaxSetup({ cache: true });
  $.getScript('https://connect.facebook.net/en_US/sdk.js', function(){
    FB.init({
      appId: '175791659716252',
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

  // Twitter Share
  var twitterText = 'This is the sharing text to share';
  twitterText = twitterText.replace(' ', '%20');
  var twitterLink = 'http://twitter.com/intent/tweet?text=' + twitterText + '&url=' + currentURL;
  $('#twitter').attr('href', twitterLink);
  $('meta[property="og:url"]').attr('content', currentURL);

  // Email
  var emailText = 'Hey, check out Publish What You Fund\'s Index 2018 results here - ' + currentURL;
  emailText.replace(' ', '%20');

  var emailSubject = 'Publish What You Fund - The Index 2018';
  emailSubject.replace(' ', '%20');
  var emailLink = 'mailto:?subject=' + emailSubject + '&body=' + emailText;
  $('#email').attr('href', emailLink);

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
