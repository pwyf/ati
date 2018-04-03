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

  // Fill Deep Dive


  var urlAgency = urlParam('agency');
  if (!urlAgency) {
    urlAgency = 'gates-foundation';
  }
  var agency = agencies[urlAgency];
  var components = agency.by_component;
  var indicators = agency.by_indicator;

  // Set comparison

    if (usAgencies.indexOf(urlAgency) > -1) {
      $('.comparison-group').text('COMPARISON GROUP : ').append('<a href="' + domain + '/multi-agency?group=us">US Agencies</a>')
    }
    else if (euAgencies.indexOf(urlAgency) > -1) {
      $('.comparison-group').text('COMPARISON GROUP : ').append('<a href="' + domain + '/multi-agency?group=eu">EU Agencies</a>')
    }
    else if (unAgencies.indexOf(urlAgency) > -1) {
      $('.comparison-group').text('COMPARISON GROUP : ').append('<a href="' + domain + '/multi-agency?group=un">UN Agencies</a>')
    }
    else if (dfiAgencies.indexOf(urlAgency) > -1) {
      $('.comparison-group').text('COMPARISON GROUP : ').append('<a href="' + domain + '/multi-agency?group=dfi">DFI Agencies</a>')
    }

  // Set change in performance
  var performances = ['very good', 'good', 'fair', 'poor', 'very poor'];
  var lastYear = $('.year span')[0];
  lastYear = $(lastYear).text();
  var performanceLowered = agency.performance_group.toLowerCase();

  var lastIndex = performances.indexOf(lastYear.toLowerCase());
  var thisIndex = performances.indexOf(performanceLowered);
  var change;

  if (lastIndex > thisIndex) {
    change = 'increase';
  }
  else if (lastIndex < thisIndex) {
    change = 'decrease';
  }
  else {
    change = 'same';
  }
  // Set Summary Card Info
  $('.summary-card .rank .score').addClass(change).addClass(performanceLowered.replace(' ', '-')).html(agency.performance_group);
  $('.top-info .score .target').html(Math.round( agency.score * 10) / 10);
  $('.top-info .position .target').html(agency.rank);

  // Set Summary Card Side Scores
  var count = 1;

  sortedIndicators = [];


  for (var k in indicators) {
   if (indicators.hasOwnProperty(k)) {
     var percent = (indicators[k] / 5) * 100;
     sortedIndicators.push([k, Math.round( percent * 10) / 10]);
   }
  }

  for (var i in components) {
    var score = Math.round( components[i] * 10) / 10;
    $('.component-' + count).find('.score').html(score + ' <span class="lighter">/ ' + componentTotals[count-1] + '</span>');
    $('.component-' + count).find('.light').html(i);
    var firstWord = [];
    var words = i.split(" ");
    firstWord.push(words[0]);
    var id = firstWord[0].toLowerCase();

    $('.tab-' + count).text(i).attr('id', 'target-' + id);
    var tabContent = $('.tab-content.component-' + count);
    tabContent.attr('id', id);
    tabContent.find('.component-name').text(i);

    var n = 0;
    while (n < 8) {
      for (var indicatorIndex in sortedIndicators) {
        setComponents(tabContent, n, indicatorIndex, sortedIndicators);
        n++;
      }
    }

    count++;
  }

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

// Set Meta
$('meta[property="og:title"]').attr('content', 'The Index 2018 | ' + agency.name);
$('meta[property="og:image"]').attr('content', $('.graph-image img').attr('src'));

document.title = 'The Index 2018 | ' + agency.name;

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

function setComponents(id, indicatorCount, indicatorIndex, sortedIndicators) {
  var indicatorScore = $(id).find('.indicator-score-' + indicatorCount);
  indicatorScore.find('.indicator-name').text(sortedIndicators[indicatorIndex][0]);
  indicatorScore.find('.modal-trigger').attr('data-indicator', sortedIndicators[indicatorIndex][0]);
  indicatorScore.find('.indicator-num').text('Score: ' + sortedIndicators[indicatorIndex][1] + '%');
  indicatorScore.find('.bar-num').width(sortedIndicators[indicatorIndex][1] + '%');
}

function median(values) {

    values.sort( function(a,b) {return a - b;} );

    var half = Math.floor(values.length/2);

    if(values.length % 2)
        return values[half];
    else
        return (values[half-1] + values[half]) / 2.0;
}
