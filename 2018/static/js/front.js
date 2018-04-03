$(document).ready(function() {

  /* Process the data that comes from results.json */

  // Get JSON data from results.json

  // Global Variables
  var graph = $('.graph');
  var table = document.getElementById('results');
  var results_rows = document.getElementById('results-rows');

  // Count for adding rows to table
  var rowCount = 0;

  // Loop through all the agencies
   for (var i in agencies) {
    // Set Variables
    var agency = agencies[i];
    var score = agency.score;
    var rank = agency.rank;
    var name = agency.name;
    var components = agency.by_component;
    var performance = agency.performance_group;


    // Turn performance into CSS class
    performanceClass = performance.replace(' ', '-').toLowerCase();

    if($(window).width() > 768) {

      // Add the bars to the graph
      graph.append('<div class="bar" data-index="' + Math.round( score * 10) / 10 + '" data-agency="' + name + '" data-slug="' + i + '"></div>');
      var agencyBar = $('.bar[data-agency="' + name +'"]');

      // Add data att for performance
      agencyBar.addClass(performanceClass).data('range', performanceClass);

      // Set count for CSS component class
      var componentCount = 1;

      // Loop through components
      for (var component in components) {
        if (components.hasOwnProperty(component)) {
          var componentScore = components[component];

            // Add each component with CSS class & score
            agencyBar.append('<div class = "component component-' + componentCount + '" data-label="' + component + '" data-raw="' + componentScore + '"></div>');
            // Set the height of each component
            agencyBar.children('.component-' + componentCount).height(componentScore + '%');
        }
        componentCount++;
      }

      // Add the agency label
      agencyBar.append('<span class="label">' + name + '</span>');
    }


    /* Create the table below */

    // Add Row
    var row = results_rows.insertRow(-1);
    row.className = 'result-row row-' + i + ' ' + performanceClass;

    var cellCount = 0;
    var checkbox = '<input type="checkbox" name="compare" class="checkbox">';
    var cells = [checkbox, rank, name, score, components, performance];

    for (var n in cells) {

      if (n == 2) {
        var cell = row.insertCell(cellCount);
        cell.className = 'cell-' + n;
        cell.innerHTML = '<a href="' + domain + '/' + i + '/">' + cells[n] + '</a>';
        cellCount++;
      }

      else if (n == 3) {
        var cell = row.insertCell(cellCount);
        cell.className = 'cell-' + n;
        cell.innerHTML = '<div class="hori-bar ' + performanceClass + '"><span class="raw-score">' + Math.round( score * 10) / 10 + ' / 100</span><div class="fill" style="width:' + Math.round( score * 10) / 10 + '%"</div></div>';
        cellCount++;
      }
      else if (n == 4) {
        if($(window).width() > 768) {
          for (var x in components) {
            var cell = row.insertCell(cellCount);
            cell.className = 'cell-performance cell-performance-' + n++;
            cell.innerHTML = Math.round( components[x] * 10) / 10;
            cellCount++;
          }
        }
      }
      else if (n == 5) {
        var cell = row.insertCell(cellCount);
        cell.className = 'cell-' + n;
        cell.innerHTML = '<span class="cat">' + cells[n] + '</span>';
        cellCount++;
      }
      else {
        var cell = row.insertCell(cellCount);
        cell.className = 'cell-' + n;
        cell.innerHTML = cells[n];
        cellCount++;
      }
      // var cellWidth = $(cell).width();
      // $(cell).css({'min-width' : cellWidth});

    }
    rowCount++;

  } // End Agency Loop


})
