$(document).ready(function() {

  $('.tab').click(function() {
    $('.tab').removeClass('active');
    $(this).addClass('active');
    var tabTarget = $(this).attr('id');
    tabTarget = tabTarget.replace('target-', '');
    $('.tab-content').hide().removeClass('active');
    $('#' + tabTarget).css({'display' : 'flex'});
    setTimeout(function() {
      $('#' + tabTarget).addClass('active');
    }, 100);
  })

  var tabs = $('.tab');


  var leftColumn = $('.left-column');
  var graphImgHeight = $('.graph-image').outerHeight();
  var deepDive = $('.deep-dive');
  var leftOffset = leftColumn.offset();
  var leftColumnLeft = leftOffset.left;
  var graphTop = leftOffset.top;
  var deepDiveTop = deepDive.offset().top;
  var graphWidth = leftColumn.width();
  var unset = (deepDiveTop - (graphImgHeight + 140));

if ($(window).width() > 991) {
  leftColumn.css({'left' : leftColumnLeft, 'width' : graphWidth});
  $(window).scroll(function() {
    var scrollTop = $(window).scrollTop();
    if((scrollTop + 30) > graphTop && scrollTop < unset) {
      leftColumn.addClass('sticky').removeClass('fixed');
    }
    else if(scrollTop > unset) {
        leftColumn.removeClass('sticky').addClass('fixed')
    }
    else {
     leftColumn.removeClass('sticky fixed');
   }


  })
  }


// Modal Trigger

$('.modal-trigger').click(function() {
  var modalContent = $(this).siblings('.indicator-modal-content');
  $('.modal-content').html(modalContent);
  var name = $(this).data('indicator');
  $('.modal-title').text(name);
  $('.modal-fill, .to-blur').addClass('active');
  $('body').addClass('fix');
  $('.close-modal').click(function() {
    $('.modal-fill, .to-blur').removeClass('active');
    $('body').removeClass('fix');
  })
})

if ($(window).width() < 991) {
  leftColumn.detach().appendTo('.mobile-fill');
}

})

function median(values) {

    values.sort( function(a,b) {return a - b;} );

    var half = Math.floor(values.length/2);

    if(values.length % 2)
        return values[half];
    else
        return (values[half-1] + values[half]) / 2.0;
}
