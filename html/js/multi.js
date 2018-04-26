$(document).ready(function() {

  if ($(window).width() < 991) {
    $('.left-column').detach().appendTo('.mobile-fill');
  }

})
