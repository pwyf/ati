$(document).ready(function() {

  $('.bar').click(function() {

    $('.component').each(function() {
      $(this).height($(this).data('raw') + '%');
    });

    // Width Change
    $('.bar').css({'flex-grow' : '1'}).removeClass('active');
    $('.component').css({'opacity' : 0.3});
    $(this).children('.component').css({'opacity' : 1});
    $(this).css({'opacity' : 1, 'flex-grow' : '3'}).addClass('active');


    // Grow Bar Relatively
    var sum = $(this).data('raw');
    $(this).children('.component').each(function(i, element) {
      var rawNum = $(this).data('raw');
      var percent = (rawNum / sum) * 100 + '%';
      $(this).height(percent);
    });

    // Add Name

    showLabel($(this));

  });

  $('.bar').hover(function() {
    showLabel($(this));
  }, function() {
    $('.name-container').hide();
  });

  function showLabel(bar) {
    $('.name-container').hide();
    if($(bar).children('.name-container').length < 1) {
      $(bar).append('<div class="name-container"><span class="number">' + $(bar).data('rounded') + '%</span><span class="name-label">' + $(bar).data('country') + '</span></div>');
    }
    $(bar).children('.name-container').show();
  }

  // Range Set

  var ranges = ['very-good', 'good', 'fair', 'poor', 'very-poor'];

  $(ranges).each(function(i, range) {
    var firstPos = ($('.' + range).first().position());
    var lastPos = ($('.' + range).last().position());

    if (firstPos && lastPos) {
      var rangeWidth = (lastPos.left + $('.bar').width() - 3.5) - firstPos.left - 3.5;
      $('#' + range).width(rangeWidth);
    }
    else {
      $('#' + range).hide();
    }



  });

  $('.category').click(function() {
    $('.category').not($(this)).css('opacity', '.5');
    $(this).css('opacity', '1');
    var category = $(this).attr('id');
    $(('.' + category)).show().css('opacity', '1');
    $('.bar').not('.' + category).hide();
    // $('.label').css('left', '40%');

  });

  $('#reset').click(function() {
    reset();
  });

//   $(document).click(function(event) {
//     if(!$(event.target).closest('.graph').length) {
//       reset();
//     }
// });

  function reset() {
    $('.name-container').hide();
    // $('.label').css('left', '40%');
    $('.category').css('opacity', '1');
    $('.bar').show();
    $('.component').each(function() {
      $(this).height($(this).data('raw') + '%');
    });
    $('.component').css({'opacity' : 1});
    $('.bar').css({'opacity' : 1, 'flex-grow' : '1'}).removeClass('active');
  }

});
