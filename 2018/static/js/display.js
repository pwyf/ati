$(document).ready(function() {
  $('select').SumoSelect();

  $('#compare').click(function() {
    $('.appear').addClass('active');
    $('#compareSel').on('change', function(event) {
      $('#done').hide();
      $('.results-table').removeClass('compare-active');
      var compare = $('#compareSel').val();
      switch (compare) {
        case 'custom' :
          $('.result-row').addClass('compare-shown').fadeIn();
          $('.results-table').addClass('compare-active');
          $('#done').show().css('display', 'inline-block');
          $('#done').click(function() {
            $(this).text('update');
            $('.result-row').removeClass('compare-shown');
            var checked = $('.checkbox:checkbox:checked');
            $.each(checked, function(i, val) {
              var thisRow = val.closest('.result-row');
              $(thisRow).addClass('compare-shown');
            })
            $('.result-row').not('.compare-shown').fadeOut();
            $(this).hide();
            })
          break;
        case 'US' :
          compareAgencies(usAgencies);
          break;
        case 'EU' :
          compareAgencies(euAgencies);
          break;
        case 'UN' :
          compareAgencies(unAgencies);
          break;
        case 'DFI' :
          compareAgencies(dfiAgencies);
          break;
        case 'BILATERAL' :
          compareAgencies(bilateralAgencies);
          break;
        case '' :
          resetSelect();
          break;
      }
      $('#cancel').text('reset');
    });

  })

  $('#cancel').click(function() {
    resetSelect();
  })

  function resetSelect() {
    $('select')[0].sumo.selectItem(0);
    $('.appear').removeClass('active');
    $('.results-table').removeClass('compare-active');
    $('.result-row').show();
  }


    var windowHeight = $(window).height();

    var headers = $('#results .headers th');
    $.each(headers, function(i, th) {
      var thWidth = $(th).width();

      $(headers[i]).width(thWidth);
    })


    if($(window).width() > 768) {

      $(window).scroll(function(windowHeight) {
        var tableButtonsTop = $('#results').offset().top;
        var scrollTop = $(window).scrollTop();



        if((scrollTop - tableButtonsTop) > 0 ) {
          $('.headers').addClass('sticky');
        } else  {
          $('.headers').removeClass('sticky');
        };
      })

      /* Do front end interaction graph bits */
       clicked = '';
      // On click of the bar
     $('.bar').click(function() {
       var slug = $(this).data('slug');

       // Reset all the other component heights
       $('.component').each(function() {
         $(this).height($(this).data('raw') + '%');
       })

       // Width Change
       $('.bar').removeClass('active').addClass('blur');
       $(this).removeClass('blur').addClass('active');


       // Grow Bar Relatively
       var sum = $(this).data('index');
       $(this).children('.component').each(function(i, element) {
         var rawNum = $(this).data('raw');
         var percent = (rawNum / sum) * 100 + '%';
         $(this).height(percent);
       });

       // Add Name
       showLabel($(this));

      var currentURL = window.location.href;
      if (clicked == slug) {
        window.location.href = domain + '/single?agency=' + slug;
     }
     clicked = slug;
     })

     var nameContainerLeft = $('.name-container').offset().left;
     var windowWidth = $(window).width();
     // Show the label
     $('.bar').hover(function() {
       showLabel($(this));
     }, function() {
       $('.name-container').hide();
     })

     // Show label function
     function showLabel(bar) {
       var barLeft = bar.offset().left;
       var barWidth = bar.width();

       // Shunt left if too far to right

       barTop = bar.offset().top;
       var barClass = bar.attr('class');
       barClass = barClass.replace('bar ', '');
      $('.name-container').html('<span class="name-label ' + barClass + '">' + $(bar).data('agency') + ' - ' + $(bar).data('index') + '</span>').show();

      if (barLeft > (windowWidth - 250)) {
        var labelWidth = $('.name-label').width();
        barLeft = barLeft - nameContainerLeft - labelWidth;
      }
      else {
        barLeft = barLeft - nameContainerLeft;
      }


      $('.name-label').css('left', barLeft);
     }

     // Range Set
      rangeSet();

      $(window).resize(function() {
        rangeSet();
      })


     // Category Focus

     $(document).click(function(event) {
       if(!$(event.target).closest('.graph').length) {
         reset();
       }
   });

     // Reset everything
     function reset() {
       $('.name-container').hide();
       $('.bar').show();
       $('.component').each(function() {
         $(this).height($(this).data('raw') + '%');
       });
       $('.bar').removeClass('active blur');
     }

     var genTable = document.getElementById('results');
     sorttable.makeSortable(genTable);
   }

 }) // End document ready

   function compareAgencies(whichCompare) {
     $('.result-row').removeClass('compare-shown');
     $.each(whichCompare, function(i, val) {
       var thisRow = '.row-' + val;
       $(thisRow).addClass('compare-shown');
       setTimeout(function(){
         $(thisRow).fadeIn();
       }, 400);
     })
     $('.result-row').not('.compare-shown').fadeOut();
   }


// Range Set Function

function rangeSet() {
  var ranges = ['very-good', 'good', 'fair', 'poor', 'very-poor'];

  $(ranges).each(function(i, range) {
    var firstPos = ($('.bar.' + range).first().position());
    var lastPos = ($('.bar.' + range).last().position());

    if (firstPos && lastPos) {
      var rangeWidth = (lastPos.left + $('.bar').width() - 3.5) - firstPos.left - 3.5;
      $('#' + range).width(rangeWidth);
    }
    else {
      $('#' + range).hide();
    }
  });
}
