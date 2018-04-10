$(document).ready(function() {

  // Fill Rankings

  var targets = usAgencies;
  var title = 'US Agencies';

  var group = urlParam('group');

  targets = comparisonAgencies[group + 'Agencies'];
  title = group.toUpperCase();

  $('.agency-name').text(title + ' Agencies');

  var performance_groups = {
    'very_good' : [],'good' : [],'fair' : [],'poor' : [],'very_poor' : []
  };



  for (var target in targets) {
    var agency = targets[target];
    var slug = agency;
    agency = agencies[agency];

    name = agency.name;
    score = Math.round( agency.score * 10) / 10 + '%';
    performance_group = agency.performance_group;
    switch (performance_group) {

      case 'Very good' :
        performance_groups.very_good.push([name, score, slug]);
        break;
      case 'Good' :
        performance_groups.good.push([name, score, slug]);
        break;
      case 'Fair' :
        performance_groups.fair.push([name, score, slug]);
        break;
      case 'Poor' :
        performance_groups.poor.push([name, score, slug]);
        break;
      case 'Very poor' :
        performance_groups.very_poor.push([name, score, slug]);
        break;
    }
  }



  var rankingsList = $('.multi-rankings');
  groupedAgencies = '';


  for (var performance_group in performance_groups) {
    group = performance_groups[performance_group];

    if (group.length > 0) {
      for (var agency in group) {
        groupedAgencies += '<span class="grouped-agency"><a href="' + domain + '/single?agency=' + group[agency][2] + '">' + group[agency][0] + '</a> - ' + group[agency][1] + '</span>';
      }
      var rankingGroup = rankingsList.append('<div class="ranking-group"><div class="rank"><span class="score ' + performance_group.toLowerCase().replace('_', '-') + '">' + performance_group.replace('_', ' ') + '</span></div>' + groupedAgencies);


    }
    groupedAgencies = '';
  }

  // Set Meta
  $('meta[property="og:title"]').attr('content', 'The Index 2018 | ' + title);
  $('meta[property="og:image"]').attr('content', $('.graph-image img').attr('src'));

  document.title = 'The Index 2018 | ' + title;

  if ($(window).width() < 991) {
    $('.left-column').detach().appendTo('.mobile-fill');
  }

})
