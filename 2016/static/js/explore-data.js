jQuery(document).ready(function($) {
    var activity_basic = 13;
	var activity_classifications = 13;
	var activity_financial = 13;
	var activity_performance = 13;
	var activity_related_documents = 13;
	var commitment = 10;
	var organisation_financial = 12.5;
	var organisation_planning = 12.5;
	var chart;
	var $report = $('#report');
	$report.html('--');

    function calculateGraph(orgsArray, resultsArray, activity_basic, activity_classifications, activity_financial, activity_performance, activity_related_documents, commitment, organisation_financial, organisation_planning, reset)
	{
		var activity_basic_weight = Math.round((activity_basic / 100) / 8 * 10000) / 10000;
		var activity_classifications_weight = Math.round((activity_classifications / 100) / 7 * 10000) / 10000;
		var activity_financial_weight = Math.round((activity_financial / 100) / 4 * 10000) / 10000;
		var activity_performance_weight = Math.round((activity_performance / 100) / 3 * 10000) / 10000;
		var activity_related_documents_weight = Math.round((activity_related_documents / 100) / 6 * 10000) / 10000;
		var commitment_weight = Math.round((commitment / 100) / 3 * 10000) / 10000;
		var organisation_financial_weight = Math.round((organisation_financial / 100) / 3 * 10000) / 10000;
		var organisation_planning_weight = Math.round((organisation_planning / 100) / 5 * 10000) / 10000;
		
		var veryGoodScores = [];
		var goodScores = [];
		var fairScores = [];
		var poorScores = [];
		var veryPoorScores = [];

		var verygoodCategories1 = [];
		var goodCategories1 = [];
		var fairCategories1 = [];
		var poorCategories1 = [];
		var verypoorCategories1 = [];

		var dataForChart = [];
		var adjustment;
		var yValue;
		var zValue;
		var myRank;
		
		var cnt = 1;

		// default scores
		scoresArray = {};
		for (var i = 0; i < orgsArray.length; i++) {
			score = orgsArray[i]['weighted_overall_result'];
			scoresArray[orgsArray[i]['donor_name']] = score;
		}

		for (i in resultsArray) 
		{
			linkurl = resultsArray[i].url;
			if (reset) {
				// use default scores
				score = scoresArray[i];
			} else {
				score += resultsArray[i].activity_basic * activity_basic_weight;
				score += resultsArray[i].activity_classifications * activity_classifications_weight;
				score += resultsArray[i].activity_financial * activity_financial_weight;
				score += resultsArray[i].activity_performance * activity_performance_weight;
				score += resultsArray[i].activity_related_documents * activity_related_documents_weight;
				score += resultsArray[i].organisation_planning * organisation_planning_weight;
				score += resultsArray[i].organisation_financial * organisation_financial_weight;
				score += resultsArray[i].commitment * commitment_weight;
				score = Math.round(score * 100) / 100;
			}

			if(score >= 80){
				veryGoodScores.push({y:score, url:resultsArray[i].url});  // these are no longer needed.
				verygoodCategories1.push({score:score, name:i, url:resultsArray[i].url});
				myRank = 0;
				category = 'vgood';
			} else if(score >= 60){
				goodScores.push({y:score, url:resultsArray[i].url});
				goodCategories1.push({score:score, name:i, url:resultsArray[i].url});
				myRank = 1;
				category = 'good';
			} else if(score >= 40){
				fairScores.push({y:score, url:resultsArray[i].url});
				fairCategories1.push({score:score, name:i, url:resultsArray[i].url});
				myRank = 2;
				category = 'fair';
			} else if(score >= 20){
				poorScores.push({y:score, url:resultsArray[i].url});
				poorCategories1.push({score:score, name:i, url:resultsArray[i].url});
				myRank = 3;
				category = 'poor';
			} else if(score < 20){
				veryPoorScores.push({y:score, url:resultsArray[i].url});
				verypoorCategories1.push({score:score, name:i, url:resultsArray[i].url});
				myRank = 4;
				category = 'vpoor';
			}

			adjustment = (100 - score)/10;
			adjustment = adjustment*0.9;
			
			yValue = Math.round(((parseFloat(score/2) + (adjustment))-1.2) * 100) / 100;
			zValue = Math.round(((parseFloat(score/2)*0.9)) * 100) / 100;	
			
			dataForChart.push({
				id: cnt,
				name: i,
				x: 10,
				y: yValue,
				z: zValue,
				rank: myRank,
				url: linkurl,
				score: parseFloat(score),
				cat: category
			});	
			cnt++;
		}
		scores = [];
		
		// CREATE INITIAL GRAPH

		vgoodCount = veryGoodScores.length;
		goodCount = goodScores.length;
		fairCount = fairScores.length;
		poorCount = poorScores.length;
		vpoorCount = veryPoorScores.length;
		
			
		if (chart) 
		{
			chart.destroy();
		}

        arr = [];
        clr = [];
        if(vpoorCount > 0){ arr.push(vpoorCount); clr.push('#E34172')};
        if(poorCount > 0){ arr.push(poorCount);clr.push('#EB7465') };
        if(fairCount > 0){ arr.push(fairCount); clr.push('#D7DB27')};
        if(goodCount > 0){ arr.push(goodCount); clr.push('#36E359')};
        if(vgoodCount > 0){ arr.push(vgoodCount); clr.push('#008CFF')};

        var rawData = arr,
            data = [
                [0, 100]
            ],
            overData = [
                [0, 0]
            ],
            underData = [
                [0, 0]
            ],
            zones = [],
            len = rawData.length,
            colors = clr,
            maxColor = colors.length,
            i,
            val,
            sum = 0,
            pos = 0,
            plotLines = [];

        for (i = 0; i < len; i++) {
            sum += rawData[i];
        }

        for (i = 0; i < len; i++) {
            pos += rawData[i];
            val = (sum - pos) / sum * 100;
            data.push([pos, val]);
            overData.push([pos, (100 - val) / 2]);
            underData.push([pos, (100 - val) / 2]);
            zones.push({
                value: pos,
                color: colors[i % maxColor]
            });

            plotLines.push({
                zIndex: 7,
                width: 3,
                color: '#757575',
                value: pos,
                label: {
                    text: rawData[i],
                    verticalAlign: 'bottom',
                    rotation: 0,
                    y: -420,
                    align: 'right',
                    x: -12,
                    style: {
                        color: colors[i % maxColor],
                        fontSize: '30px' ,
						fontFamily: 'Oswald'
                    }
                }
            });
        }

        // This is the background graph (renders to div id #graph)
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'graph',
                type: 'area',
                backgroundColor: 'transparent',
                height: 985,
				marginBottom: 0,
                marginLeft:-5,
                marginRight:-7
            },
            plotOptions: {
                area: {
                    enableMouseTracking: false,
                    showInLegend: false,
                    stacking: 'percent',
                    lineWidth: 0,
                    marker: {
                        fillColor: 'transparent',
                        states: {
                            hover: {
                                lineColor: 'transparent'
                            }
                        }
                    }
                }
            },
            series:
                [
                    {
                        name: 'over',
                        color: 'none',
                        data: overData
                    },
                    {
                        id: 's1',
                        name: 'Series 1',
                        data: data,
                        showInLegend: true,
                        zoneAxis: 'x',
                        zones: zones,
                        fillOpacity: 1
                    },
                    {
                        name: 'under',
                        color: 'none',
                        data: underData
                    }
                ],
            xAxis: {
                plotLines: plotLines,
                gridLineColor: 'transparent',
                lineColor: 'transparent',
                labels: {
                    enabled: false
                },
                tickWidth: 0
            },
            yAxis: {
                title: {
                    text: ''
                },
                gridLineColor: 'transparent',
                lineColor: 'transparent',
                labels: {
                    enabled: false
                },
                tickWidth: 0
                ,min: -85
            },
            legend: {
                enabled: false
            },
            title: {
                text: ''
            },
            credits: {
                enabled: false
            },
            tooltip: {
                enabled: false
            }
        });

        for(i in dataForChart){
            point = dataForChart[i].score;
            score = parseFloat(point);
            datascore = score;
            score = (datascore*483)/100;
			equidistantsegment = 7.5;
			posFromLeft = 46 - (i);/*need to invert the count*/
			donorPosition = 8 + ((posFromLeft-1)*3) + (equidistantsegment * (posFromLeft-1));
            chart.renderer.path(['M', donorPosition, 0, 'V', 300])
                .attr({
                    'stroke-width': 3,
                    stroke: '#AAAAAA',
                    zIndex: 2
                })
                .add();
        }

        for(i in dataForChart){

            point = dataForChart[i].score;
            score = parseFloat(point);
            datascore = score;
            score = (datascore*483)/100;
			equidistantsegment = 7.5;
			posFromLeft = 46 - (i);/*need to invert the count*/
			donorPosition = 8 + ((posFromLeft-1)*3) + (equidistantsegment * (posFromLeft-1));
            chart.renderer.path(['M', donorPosition, 11, 'V', 971])
                .attr({
                    'stroke-width': 3,
                    stroke: 'transparent',
                    zIndex: 201,
                    'data-id': dataForChart[i].id,
                    class: 'line',
                    'data-url': dataForChart[i].url,
                    'data-name': dataForChart[i].name,
                    'data-score': dataForChart[i].score
                })
                .on('mouseover',function(){
                    $(this).attr({
                        'stroke': 'white'
                    });

                })
                .on('mouseout',function(){
                    $(this).attr({
                        'stroke': 'transparent'
                    });
                })
                .add();

            $('.line').on('mouseover',function(){
                $('#span_'+$(this).data('id')).addClass('selected');
                rank = $(this).data('id');
                name = $(this).data('name');
                score = '<span class="donorscorelight">'+$(this).data('score')+'%</psan>';
                var $report = $('#report');
                $($report).html(rank + '. ' + name + ' ' +score );

            });

            $('.line').on('mouseout',function(){
                $('#span_'+$(this).data('id')).removeClass('selected');
                var $report = $('#report');
                $($report).html('--');
            });

            $('.line').on('click',function(){
                location.href = $(this).data('url');
            });
        }

        createRankingsColumn(veryGoodScores, verygoodCategories1, goodScores, goodCategories1, fairScores, fairCategories1, poorScores, poorCategories1, veryPoorScores, verypoorCategories1);

		$('.rankings-column span').hover(function(e) {
			var myId = $(this).attr('id');
            myId = myId.replace('span_', '');
            donorname = $(this).data("name");
            datascore = $(this).data("score");
            score = (datascore*483)/100;
			equidistantsegment = 7.5;
			posFromLeft = 46 - (myId - 1);/*need to invert the count*/
			donorPosition = 8 + ((posFromLeft-1)*3) + (equidistantsegment * (posFromLeft-1));

            chart.renderer.path(['M', donorPosition, 11, 'V', 971])
                .attr({
                    'id': 'line_' + myId,
                    'stroke-width': 3,
                    stroke: 'white',
                    zIndex: 1000
                })
                .add();


            $report.html(myId + '. ' + donorname + ' <span class="donorscorelight">' + datascore + '%</span>');
			$(this).parent().parent().parent().find('span.selected').removeClass('selected');

            $(this).parent().addClass('selected');
			$report.addClass('active');
		}, function() {
			var myId = $(this).attr('id');
			$(this).parent().removeClass('selected');
			$report.removeClass('active');
			$report.html('--');
            chart.redraw();
            myId = myId.replace('span_', '');
            $("#line_"+myId).remove() ;

		});
	}
	calculateGraph(orgsArray, resultsArray, activity_basic, activity_classifications, activity_financial, activity_performance, activity_related_documents, commitment, organisation_financial, organisation_planning, true);
	
	// END CALCULATEGRAPH 

// ============================================================================================================================================ //

	// START RECALCULATEGRAPH 

	function recalculateGraph(resultsArray, orgsArray, activity_basic, activity_classifications, activity_financial, activity_performance, activity_related_documents, commitment, organisation_financial, organisation_planning, reset) 
	{
		activity_basic_weight = Math.round((activity_basic / 100) / 8 * 10000) / 10000;
		activity_classifications_weight = Math.round((activity_classifications / 100) / 7 * 10000) / 10000;
		activity_financial_weight = Math.round((activity_financial / 100) / 4 * 10000) / 10000;
		activity_performance_weight = Math.round((activity_performance / 100) / 3 * 10000) / 10000;
		activity_related_documents_weight = Math.round((activity_related_documents / 100) / 6 * 10000) / 10000;
		commitment_weight = Math.round((commitment / 100) / 3 * 10000) / 10000;
		organisation_financial_weight = Math.round((organisation_financial / 100) / 3 * 10000) / 10000;
		organisation_planning_weight = Math.round((organisation_planning / 100) / 5 * 10000) / 10000;

		veryGoodScores 		= new Array();
		goodScores 			= new Array();
		fairScores 			= new Array();
		poorScores 			= new Array();
		veryPoorScores 		= new Array();

		verygoodCategories 	= new Array();
		goodCategories 		= new Array();
		fairCategories 		= new Array();
		poorCategories 		= new Array();
		verypoorCategories 	= new Array();
		var dataForChart = [];
		var adjustment;
		var myRank;
		var yValue;
		var zValue;
		
		var cnt = 1;

		// default scores
		scoresArray = {};
		for (var i = 0; i < orgsArray.length; i++) {
			score = orgsArray[i]['weighted_overall_result'];
			scoresArray[orgsArray[i]['donor_name']] = score;
		}

		for (i in resultsArray) {
			linkurl = resultsArray[i].url;
			if (reset) {
				// use default scores
				score = scoresArray[i];
			} else {
				score = 0;
				score += resultsArray[i].activity_basic * activity_basic_weight;
				score += resultsArray[i].activity_classifications * activity_classifications_weight;
				score += resultsArray[i].activity_financial * activity_financial_weight;
				score += resultsArray[i].activity_performance * activity_performance_weight;
				score += resultsArray[i].activity_related_documents * activity_related_documents_weight;
				score += resultsArray[i].organisation_planning * organisation_planning_weight;
				score += resultsArray[i].organisation_financial * organisation_financial_weight;
				score += resultsArray[i].commitment * commitment_weight;
				score = Math.round(score * 100) / 100;
			}

			if(score >= 80){
				veryGoodScores.push({y:score, url:resultsArray[i].url});  // these are no longer needed.
				verygoodCategories.push({score:score, name:i, url:resultsArray[i].url});
				myRank = 0;
				category = 'vgood';
			} else if(score >= 60){
				goodScores.push({y:score, url:resultsArray[i].url});
				goodCategories.push({score:score, name:i, url:resultsArray[i].url});
				myRank = 1;
				category = 'good';
			} else if(score >= 40){
				fairScores.push({y:score, url:resultsArray[i].url});
				fairCategories.push({score:score, name:i, url:resultsArray[i].url});
				myRank = 2;
				category = 'fair';
			} else if(score >= 20){
				poorScores.push({y:score, url:resultsArray[i].url});
				poorCategories.push({score:score, name:i, url:resultsArray[i].url});
				myRank = 3;
				category = 'poor';
			} else if(score < 20){
				veryPoorScores.push({y:score, url:resultsArray[i].url});
				verypoorCategories.push({score:score, name:i, url:resultsArray[i].url});
				myRank = 4;
				category = 'vpoor';
			}

			// adjustment = (100 - score)/10;
			// adjustment = adjustment *1.2;
			
			// yValue = Math.round(((parseFloat(score/2) + (adjustment))-2) * 100) / 100;
			// zValue = Math.round(((parseFloat(score/2)*0.9)) * 100) / 100;

			adjustment = (100 - score)/10;
			adjustment = adjustment*0.9;
			
			yValue = Math.round(((parseFloat(score/2) + (adjustment))-1.2) * 100) / 100;
			zValue = Math.round(((parseFloat(score/2)*0.9)) * 100) / 100;	

			
			dataForChart.push({
				id: cnt,
				name: i,
				x: 10,
				y: yValue,
				z: zValue,
				rank: myRank,
				url: linkurl,
				score: parseFloat(score),
				cat: category
			});	
			cnt++;
		}
		scores = [];
		// CREATE INITIAL GRAPH

		vgoodCount 	= veryGoodScores.length;
		goodCount 	= goodScores.length;
		fairCount 	= fairScores.length;
		poorCount 	= poorScores.length;
		vpoorCount 	= veryPoorScores.length;
		scoresArray = {};
		
		for (var i = 0; i < orgsArray.length; i++) 
		{
			score = orgsArray[i]['weighted_overall_result'];
			scoresArray[orgsArray[i]['donor_name']] = score;
		}

		dataForChart.sort(function(a, b)
		{
			if (a.score < b.score)
				return 1;
			if (a.score > b.score)
				return -1;
			// a must be equal to b
			return 0;
		});

        verygoodCategories.sort(function(a, b)
		{
			if (a.score < b.score)
				return 1;
			if (a.score > b.score)
				return -1;
			// a must be equal to b
			return 0;
		});
		
		goodCategories.sort(function(a, b) 
		{
			if (a.score < b.score)
				return 1;
			if (a.score > b.score)
				return -1;
			// a must be equal to b
			return 0;
		});
		
		fairCategories.sort(function(a, b) 
		{
			if (a.score < b.score)
				return 1;
			if (a.score > b.score)
				return -1;
			// a must be equal to b
			return 0;
		});
		
		poorCategories.sort(function(a, b) 
		{
			if (a.score < b.score)
				return 1;
			if (a.score > b.score)
				return -1;
			// a must be equal to b
			return 0;
		});
		
		verypoorCategories.sort(function(a, b) 
		{
			if (a.score < b.score)
				return 1;
			if (a.score > b.score)
				return -1;
			// a must be equal to b
			return 0;
		});

		veryGoodScores.sort(function(a, b) 
		{
			if (a.y < b.y)
				return 1;
			if (a.y > b.y)
				return -1;
			// a must be equal to b
			return 0;
		});
		
		goodScores.sort(function(a, b) 
		{
			if (a.y < b.y)
				return 1;
			if (a.y > b.y)
				return -1;
			// a must be equal to b
			return 0;
		});
		
		fairScores.sort(function(a, b) 
		{
			if (a.y < b.y)
				return 1;
			if (a.y > b.y)
				return -1;
			// a must be equal to b
			return 0;
		});
		
		poorScores.sort(function(a, b) 
		{
			if (a.y < b.y)
				return 1;
			if (a.y > b.y)
				return -1;
			// a must be equal to b
			return 0;
		});
		
		veryPoorScores.sort(function(a, b) 
		{
			if (a.y < b.y)
				return 1;
			if (a.y > b.y)
				return -1;
			// a must be equal to b
			return 0;
		});

		vgoodCount 	= veryGoodScores.length;
		goodCount 	= goodScores.length;
		fairCount 	= fairScores.length;
		poorCount 	= poorScores.length;
		vpoorCount 	= veryPoorScores.length;

		$('.rankings-column.first').empty();
		$('.rankings-column.second').empty();
		$('.rankings-column.third').empty();

		donorcount 	= 1;
		first 		= 0;
		thishtml1 	= '';
		thishtml2 	= '';
		thishtml3 	= '';

		for (var i = 0; i < verygoodCategories.length; i++) 
		{
			thishtml = '';
			if (first == 0) 
			{
				thishtml += '<div class="rankings-column first">';
				thishtml += '<h3 class="ranking vgood">Very Good</h3>';
			}
			
			thishtml += '<span id="' + donorcount + '" class="0" data-score="' + verygoodCategories[i].score + '" data-name="' + verygoodCategories[i].name + '"><a href="' + verygoodCategories[i].url + '" title="' + verygoodCategories[i].name + '">' + donorcount + '. ' + verygoodCategories[i].name + '</a></span>';
			
			if (donorcount < 17)
			{
				thishtml1 += thishtml;
			} 
			else if (donorcount > 16 && donorcount < 32)
			{
				thishtml2 += thishtml;
			} 
			else 
			{
				thishtml3 += thishtml;
			}

            first++;
			donorcount++;
		}

		first = 0;
		for (var i = 0; i < goodCategories.length; i++) 
		{
			thishtml = '';
			if (first == 0) 
			{
				thishtml += '<h3 class="ranking good">Good</h3>';
			}
			
			thishtml += '<span id="' + donorcount + '" class="1" data-score="' + goodCategories[i].score + '" data-name="' + goodCategories[i].name + '"><a href="' + goodCategories[i].url + '" title="' + goodCategories[i].name + '">' + donorcount + '. ' + goodCategories[i].name + '</a></span>';
			
			if (donorcount < 17)
			{
				thishtml1 += thishtml;
			} 
			else if (donorcount > 16 && donorcount < 32)
			{
				thishtml2 += thishtml;
			} 
			else 
			{
				thishtml3 += thishtml;
			}
			first++;
			donorcount++;
		}

		first = 0;
		for (var i = 0; i < fairCategories.length; i++) 
		{
			thishtml = '';
			if (first == 0) 
			{
				thishtml += '<h3 class="ranking fair">fair</h3>';
			}
			
			thishtml += '<span id="' + donorcount + '" class="2" data-score="' + fairCategories[i].score + '" data-name="' + fairCategories[i].name + '"><a href="' + fairCategories[i].url + '" title="' + fairCategories[i].name + '">' + donorcount + '. ' + fairCategories[i].name + '</a></span>';
			
			if (donorcount < 17)
			{
				thishtml1 += thishtml;
			} 
			else if (donorcount > 16 && donorcount < 32)
			{
				thishtml2 += thishtml;
			} 
			else 
			{
				thishtml3 += thishtml;
			}
			first++;
			donorcount++;
		}

		first = 0;
		for (var i = 0; i < poorCategories.length; i++) 
		{
			thishtml = '';
			if (first == 0) 
			{
				thishtml += '<h3 class="ranking poor">Poor</h3>';
			}
			
			thishtml += '<span id="' + donorcount + '" class="3" data-score="' + poorCategories[i].score + '" data-name="' + poorCategories[i].name + '"><a href="' + poorCategories[i].url + '" title="' + poorCategories[i].name + '">' + donorcount + '. ' + poorCategories[i].name + '</a></span>';
			if (donorcount < 17)
			{
				thishtml1 += thishtml;
			} 
			else if (donorcount > 16 && donorcount < 32)
			{
				thishtml2 += thishtml;
			} 
			else 
			{
				thishtml3 += thishtml;
			}
			first++;
			donorcount++;
		}

		first = 0;
		for (var i = 0; i < verypoorCategories.length; i++) 
		{
			thishtml = '';
			if (first == 0) 
			{
				thishtml += '<h3 class="ranking vpoor">Very Poor</h3>';
			}
			thishtml += '<span id="' + donorcount + '" class="4" data-score="' + verypoorCategories[i].score + '" data-name="' + verypoorCategories[i].name + '"><a href="' + verypoorCategories[i].url + '" title="' + verypoorCategories[i].name + '">' + donorcount + '. ' + verypoorCategories[i].name + '</a></span>';
			if (donorcount < 17)
			{
				thishtml1 += thishtml;
			} 
			else if (donorcount > 16 && donorcount < 32)
			{
				thishtml2 += thishtml;
			} 
			else 
			{
				thishtml3 += thishtml;
			}
			first++;
			donorcount++;
		}

		$('.rankings-column.first').append(thishtml1);
		$('.rankings-column.second').append(thishtml2);
		$('.rankings-column.third').append(thishtml3);
        arr = [];
        clr = [];
        if(vpoorCount > 0){ arr.push(vpoorCount); clr.push('#E34172')};
        if(poorCount > 0){ arr.push(poorCount);clr.push('#EB7465') };
        if(fairCount > 0){ arr.push(fairCount); clr.push('#D7DB27')};
        if(goodCount > 0){ arr.push(goodCount); clr.push('#36E359')};
        if(vgoodCount > 0){ arr.push(vgoodCount); clr.push('#008CFF')};
        //clr.reverse();

        var rawData = arr,
            data = [
                [0, 100]
            ],
            overData = [
                [0, 0]
            ],
            underData = [
                [0, 0]
            ],
            zones = [],
            len = rawData.length,
            colors = clr,
            maxColor = colors.length,
            i,
            val,
            sum = 0,
            pos = 0,
            plotLines = [];

        for (i = 0; i < len; i++) {
            sum += rawData[i];
        }

        for (i = 0; i < len; i++) {
            pos += rawData[i];
            val = (sum - pos) / sum * 100;
            data.push([pos, val]);
            overData.push([pos, (100 - val) / 2]);
            underData.push([pos, (100 - val) / 2]);
            zones.push({
                value: pos,
                color: colors[i % maxColor]
            });

            plotLines.push({
                zIndex: 7,
                width: 3,
                color: '#757575',
                value: pos,
                label: {
                    text: rawData[i],
                    verticalAlign: 'bottom',
                    rotation: 0,
                    y: -420,
                    align: 'right',
                    x: -12,
                    style: {
                        color: colors[i % maxColor],
                        fontSize: '30px' ,
						fontFamily: 'Oswald'
                    }
                }
            });
        }

        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'graph',
                type: 'area',
                backgroundColor: 'transparent',
                height: 985,
                marginBottom: 0,
                marginLeft:-5,
                marginRight:-7
            },
            plotOptions: {
                area: {
                    enableMouseTracking: false,
                    showInLegend: false,
                    stacking: 'percent',
                    lineWidth: 0,
                    marker: {
                        fillColor: 'transparent',
                        states: {
                            hover: {
                                lineColor: 'transparent'
                            }
                        }
                    }
                },
                series: {
                    animation: false
                }
            },
            series:
                [
                    {
                        name: 'over',
                        color: 'none',
                        data: overData
                    },
                    {
                        id: 's1',
                        name: 'Series 1',
                        data: data,
                        showInLegend: true,
                        zoneAxis: 'x',
                        zones: zones,
                        fillOpacity: 1
                    },
                    {
                        name: 'under',
                        color: 'none',
                        data: underData
                    }
                ],
            xAxis: {
                plotLines: plotLines,
                gridLineColor: 'transparent',
                lineColor: 'transparent',
                labels: {
                    enabled: false
                },
                tickWidth: 0
            },
            yAxis: {
                title: {
                    text: ''
                },
                gridLineColor: 'transparent',
                lineColor: 'transparent',
                labels: {
                    enabled: false
                },
                tickWidth: 0
                ,min: -85
            },
            legend: {
                enabled: false
            },
            title: {
                text: ''
            },
            credits: {
                enabled: false
            },
            tooltip: {
                enabled: false
            }
        });

        for(i in dataForChart){
            point = dataForChart[i];
            score = parseFloat(point.score);
            //scores.push(Math.round(score * 100) / 100);
            datascore = score;
            score = (datascore*483)/100;
			equidistantsegment = 7.5;
			posFromLeft = 46 - (i);/*need to invert the count*/
			donorPosition = 8 + ((posFromLeft-1)*3) + (equidistantsegment * (posFromLeft-1));
            chart.renderer.path(['M', donorPosition, 0, 'V', 300])
                .attr({
                    'stroke-width': 3,
                    stroke: '#AAAAAA',
                    zIndex: 2
                })
                .add();
        }


        for(i in dataForChart){

            point = dataForChart[i].score;
            score = parseFloat(point);
            datascore = score;
            score = (datascore*483)/100;
			posFromLeft = 46 - (i - 1);/*need to invert the count*/
			equidistantsegment = 7.5;
			posFromLeft = 46 - (i);/*need to invert the count*/
			donorPosition = 8 + ((posFromLeft-1)*3) + (equidistantsegment * (posFromLeft-1));
            chart.renderer.path(['M', donorPosition, 11, 'V', 971])
                .attr({
                    'stroke-width': 3,
                    stroke: 'transparent',
                    zIndex: 201,
                    'data-id': dataForChart[i].id,
                    class: 'line',
                    'data-url': dataForChart[i].url,
                    'data-name': dataForChart[i].name,
                    'data-score': dataForChart[i].score
                })
                .on('mouseover',function(){
                    $(this).attr({
                        'stroke': 'white'
                    });

                })
                .on('mouseout',function(){
                    $(this).attr({
                        'stroke': 'transparent'
                    });
                })
                .add();

            $('.line').on('mouseover',function(){
                id = $(this).data('id');

                $('#'+id).addClass('selected');
                rank = $(this).data('id');
                name = $(this).data('name');
                score = '<span class="donorscorelight">'+$(this).data('score')+'%</span>';
                var $report = $('#report');
                $($report).html(rank + '. ' + name + ' ' +score );
            });
            $('.line').on('mouseout',function(){
                $('#'+$(this).data('id')).removeClass('selected');
                var $report = $('#report');
                $($report).html('--');
            });

            $('.line').on('click',function(){
                location.href = $(this).data('url');
            });
        }

		$('.rankings-column span').hover(function(e) {
			var myId = $(this).attr('id');
            donorname = $(this).data( "name" );
            datascore = $(this).data( "score" );
            score = (datascore*483)/100;
            myId = myId.replace('span_', '');
            $report.html(myId + '. ' + donorname + ' <span class="donorscorelight">' + datascore + '%</span>');
			$(this).parent().parent().parent().find('span.selected').removeClass('selected');
			$(this).parent().addClass('selected');
			$report.addClass('active');
			equidistantsegment = 7.5;
			posFromLeft = 46 - (myId - 1);/*need to invert the count*/
			donorPosition = 8 + ((posFromLeft-1)*3) + (equidistantsegment * (posFromLeft-1));
            chart.renderer.path(['M', donorPosition, 11, 'V', 971])
                .attr({
                    'id': 'line_' + myId,
                    'stroke-width': 3,
                    stroke: 'white',
                    zIndex: 1000
                })
                .add();
        }, function() {
			var myId = $(this).attr('id');
			$(this).parent().removeClass('selected');
			$report.removeClass('active');
			$report.html('--');
            chart.redraw();
            $("#line_"+myId).remove() ;
		});
	}

	// END RECALCULATEGRAPH 

// ============================================================================================================================================ //

	// START CREATERANKINGSCOLUMN		

	function createRankingsColumn(veryGoodScores, verygoodCategories1, goodScores, goodCategories1, fairScores, fairCategories1, poorScores, poorCategories1, veryPoorScores, verypoorCategories1) {
		
		donorcount = 1;
		first = 0;
		thishtml1 = '';
		thishtml2 = '';
		thishtml3 = '';
		for (var i = 0; i < verygoodCategories1.length; i++) {
			thishtml = '';


			if (first == 0) {
				thishtml += '<div class="rankings-column first">';
				thishtml += '<h3 class="ranking vgood">Very Good</h3>';
			}
			thishtml += '<span id="span_' + donorcount + '" class="0" data-score="' + verygoodCategories1[i].score + '" data-name="' + verygoodCategories1[i].name + '"><a href="' + verygoodCategories1[i].url + '" title="' + verygoodCategories1[i].name + '">' + donorcount + '. ' + verygoodCategories1[i].name + '</a></span>';
			if (donorcount < 17) {
				thishtml1 += thishtml;
			} else if (donorcount > 16 && donorcount < 32) {
				thishtml2 += thishtml;
			} else {
				thishtml3 += thishtml;
			}
			first++;
			donorcount++;
		}

		first = 0;
		for (var i = 0; i < goodCategories1.length; i++) {
			thishtml = '';
			if (first == 0) {
				thishtml += '<h3 class="ranking good">Good</h3>';
			}
			thishtml += '<span id="span_' + donorcount + '" class="1" data-score="' + goodCategories1[i].score + '" data-name="' + goodCategories1[i].name + '"><a href="' + goodCategories1[i].url + '" title="' + goodCategories1[i].name + '">' + donorcount + '. ' + goodCategories1[i].name + '</a></span>';
			if (donorcount < 17) {
				thishtml1 += thishtml;
			} else if (donorcount > 16 && donorcount < 32) {
				thishtml2 += thishtml;
			} else {
				thishtml3 += thishtml;
			}
			first++;
			donorcount++;
		}

		first = 0;
		for (var i = 0; i < fairCategories1.length; i++) 
		{
			thishtml = '';
			if (first == 0) {
				thishtml += '<h3 class="ranking fair">fair</h3>';
			}
			thishtml += '<span id="span_' + donorcount + '" class="2" data-score="' + fairCategories1[i].score + '" data-name="' + fairCategories1[i].name + '"><a href="' + fairCategories1[i].url + '" title="' + fairCategories1[i].name + '">' + donorcount + '. ' + fairCategories1[i].name + '</a></span>';
			if (donorcount < 17)
			{
				thishtml1 += thishtml;
			} else if (donorcount > 16 && donorcount < 32)
			{
				thishtml2 += thishtml;
			} 
			else 
			{
				thishtml3 += thishtml;
			}
			first++;
			donorcount++;
		}

		first = 0;
		for (var i = 0; i < poorCategories1.length; i++) 
		{
			thishtml = '';
			if (first == 0) 
			{
				thishtml += '<h3 class="ranking poor">Poor</h3>';
			}
			thishtml += '<span id="span_' + donorcount + '" class="3" data-score="' + poorCategories1[i].score + '" data-name="' + poorCategories1[i].name + '"><a href="' + poorCategories1[i].url + '" title="' + poorCategories1[i].name + '">' + donorcount + '. ' + poorCategories1[i].name + '</a></span>';
			if (donorcount < 17)
			{
				thishtml1 += thishtml;
			} 
			else if (donorcount > 16 && donorcount < 32)
			{
				thishtml2 += thishtml;
			} 
			else 
			{
				thishtml3 += thishtml;
			}
			first++;
			donorcount++;
		}

		first = 0;
		for (var i = 0; i < verypoorCategories1.length; i++) 
		{
			thishtml = '';
			if (first == 0) {
				thishtml += '<h3 class="ranking vpoor">Very Poor</h3>';
			}
			thishtml += '<span id="span_' + donorcount + '" class="4" data-score="' + verypoorCategories1[i].score + '" data-name="' + verypoorCategories1[i].name + '"><a href="' + verypoorCategories1[i].url + '" title="' + verypoorCategories1[i].name + '">' + donorcount + '. ' + verypoorCategories1[i].name + '</a></span>';
			if (donorcount < 17)
			{
				thishtml1 += thishtml;
			} 
			else if (donorcount > 16 && donorcount < 32)
			{
				thishtml2 += thishtml;
			} 
			else 
			{
				thishtml3 += thishtml;
			}
			first++;
			donorcount++;
		}
		$('.rankings-column.first').append(thishtml1);
		$('.rankings-column.second').append(thishtml2);
		$('.rankings-column.third').append(thishtml3);
	};
	// END CREATE COLUMS


// ============================================================================================================================================ //
	
	// WEIGHTING BUTTON APPLY 
	
	$('.weightingbtn.apply').on('click', function(e)
	{	
		if($(this).hasClass('enabled'))
		{
			recalculateGraph(resultsArray, orgsArray, activity_basic, activity_classifications, activity_financial, activity_performance, activity_related_documents, commitment, organisation_financial, organisation_planning, false);	
		} 
		else 
		{
			alert('Please change the weightings first!');
		}
	})	
	// END WEIGHTING BUTTON APPLY

// ============================================================================================================================================ //

	// START WEIGHTING BUTTON RESET 

	$('.weightingbtn.reset').click(function(e)
	{
		
		activity_basic 				= 13;
		activity_classifications 	= 13;
		activity_financial 			= 13;
		activity_performance 		= 13;
		activity_related_documents 	= 13;
		commitment 					= 10;
		organisation_financial 		= 12.5;
		organisation_planning 		= 12.5;

		if($(this).hasClass('enabled'))
		{
			$('.weightingbtn.apply').removeClass('enabled');
			$(this).removeClass('enabled');
			// Resize weighting tool elements
			
			$('#commitment').animate({height: 30},500);
			$('#organisation').animate({height: 75},500);
			$('#activity').animate({height: 195},500);
			
			$('#act .weighting-category').each(function()
			{
				$(this).animate({height: 37},500);
			});
			
			$('.weighting-category.organisation .weighting-category').each(function() 
			{
				$(this).animate({height: '50%'},500);
			});
			
			$('#org .weighting-category').each(function() 
			{
				$(this).find($('span')).text('12.5%');
			});		
			
			$('#commitment span.percentage-reading').text('10%');
			$('#organisation span.percentage-reading').text('25%');
			$('#activity span.percentage-reading').text('65%');
			$('#commitment #com span').text('10%');
			
			$('#act .weighting-category').each(function() 
			{
				$(this).find($('span')).text('13%');
			});
			
			$('.weighting-category').each(function()
			{
				$(this).removeClass('zero');
			})
	
			//redraw with original data
			recalculateGraph(resultsArray, orgsArray, activity_basic, activity_classifications, activity_financial, activity_performance, activity_related_documents, commitment, organisation_financial, organisation_planning, true);
		} 
		else 
		{
			return false;
		}
	});
	
	// END WIGHTING BUTTON RESET 

// ============================================================================================================================================ //

	// RESIZABLE STARTS FROM HERE TO END OF FILE 

	$('#commitment').resizable({
		minHeight: 0,
		maxHeight: 300,
		handles: 's',
		grid: 3,
		start: function(event, ui) {
			$('.weightingbtn').each(function() {
				$(this).addClass('enabled');
			});
			com_orig_height 			= $(this).height();
			org_orig_height 			= $("#organisation").height();
			act_orig_height 			= $("#activity").height();
			org_orig_height_percentage 	= $("#organisation").height() / (300 - $('#commitment').height());
			act_orig_height_percentage 	= $("#activity").height() / (300 - $('#commitment').height());
			orgfin_orig_percentage 		= $('#org .financial').height() / $('#org').height();
			orgplan_orig_percentage 	= $('#org .planning').height() / $('#org').height();

			actheight1 = 0;
			$('#act .weighting-category').each(function() {
				actheight1 += $(this).height();
			})
			basic_o_percent 			= $('#act .basic').height() / (actheight1);
			class_o_percent 			= $('#act .classifications').height() / (actheight1);
			related_o_percent 			= $('#act .related').height() / (actheight1);
			financial_o_percent 		= $('#act .financial').height() / (actheight1);
			performance_o_percent 		= $('#act .performance').height() / (actheight1);

		},
		resize: function(event, ui) {
			orgheight = $('#org .financial').height() + $('#org .planning').height();
			$('#org .financial span').text(function() {
				fin_weight = (($('#org .financial').height()) / orgheight) * (($('#organisation').height()) / 300);
				if (orgheight == 0) {
					var fin_integer = 0 + '%';
				} else {
					if (!$('#organisation').hasClass('zero')) {
						if ($('#org .planning').hasClass('zero')) {
							var fin_integer = Math.round(($('#organisation').height() / 300) * 100) + '%';
						} else {
							var fin_integer = Math.round(fin_weight * 100) + '%';
						}
					}
				}
				return fin_integer;
			});
			$('#org .planning span').text(function() {
				fin_weight = (($('#org .planning').height()) / orgheight) * (($('#organisation').height()) / 300);
				if (orgheight == 0) {
					plan_integer = 0 + '%';
				} else {
					if (!$('#organisation').hasClass('zero')) {
						if ($('#org .financial').hasClass('zero')) {
							plan_integer = Math.round(($('#organisation').height() / 300) * 100) + '%';
						} else {
							plan_integer = Math.round(fin_weight * 100) + '%';
						}
					}
				}
				return plan_integer;
			});

			diff = com_orig_height - $(this).height();
			if ($('#commitment').height() > com_orig_height || com_orig_height < 298) {
				$("#organisation").height((300 - $('#commitment').height()) * org_orig_height_percentage);
				$("#activity").height((300 - $('#commitment').height()) * act_orig_height_percentage);
			} else {
				$("#organisation").height(diff * 0.5);
				$("#activity").height(diff * 0.5);
			}
			if ($('#activity').height() > 0) {
				$('#activity').removeClass('zero');
			}
			if ($('#commitment').height() > 10) {
				$('#commitment').removeClass('zero');
			}
			if ($('#organisation').height() > 10) {
				$('#organisation').removeClass('zero');
			}
			totalheight = 0;
			$('#weightingtool-wrapper > .weighting-category').each(function() {
				if (!$(this).hasClass('zero')) {
					totalheight += $(this).height();
				}
			});

			if (org_orig_height > 10) {
				$('#org .financial').height($('#org').height() * orgfin_orig_percentage);
				$('#org .planning').height($('#org').height() * orgplan_orig_percentage);
				if ($('#org .planning').height() > 10) {
					$('#org .planning').removeClass('zero');
				}
				if ($('#org .financial').height() > 10) {
					$('#org .financial').removeClass('zero');
				}

			} else {
				orgdiff = $('#organisation').height();
				$('#org .financial').height(orgdiff * 0.5);
				$('#org .planning').height(orgdiff * 0.5);
				if ($('#org .planning').height() > 10) {
					$('#org .planning').removeClass('zero');
				}
				if ($('#org .financial').height() > 10) {
					$('#org .financial').removeClass('zero');
				}
			}

			var cell1_weight;
			var cell2_weight;
			var cell3_weight;
			$('#commitment span.percentage-reading').text(function() {
				cell1_weight = (($('.commitment').height()) / totalheight);
				if (!$('#commitment').hasClass('zero')) {
					var cell1integer = Math.round(cell1_weight * 100) + '%';
				} else {
					var cell1integer = 0 + '%';
				}
				return cell1integer;
			});

			$('#organisation span.percentage-reading').text(function() {
				cell2_weight = (($('.organisation').height()) / totalheight);
				if (!$('#organisation').hasClass('zero')) {
					var cell2integer = Math.round(cell2_weight * 100) + '%';
				} else {
					var cell2integer = 0 + '%';
				}
				return cell2integer;
			});

			$('#activity span.percentage-reading').text(function() {
				cell3_weight = (($('.activity').height()) / totalheight);
				if (!$('#activity').hasClass('zero')) {
					var cell3integer = Math.round(cell3_weight * 100) + '%';
				} else {
					var cell3integer = 0 + '%';
				}
				return cell3integer;
			});
			$('#commitment #com span').text(function() {
				cell1_weight = (($('.commitment').height()) / totalheight);
				if (!$('#commitment').hasClass('zero')) {
					var cell1integer = Math.round(cell1_weight * 100) + '%';
				} else {
					var cell1integer = 0 + '%';
				}
				return cell1integer;
			});
			orgheight = $('#org .financial').height() + $('#org .planning').height();
			$('#org .financial span').text(function() {
				fin_weight = (($('#org .financial').height()) / orgheight) * (($('#organisation').height()) / 300);
				if (!$('#organisation').hasClass('zero')) {
					if ($('#org .planning').hasClass('zero')) {
						var fin_integer = Math.round(($('#organisation').height() / 300) * 100) + '%';
					} else {
						var fin_integer = Math.round(fin_weight * 100) + '%';
					}
				} else {
					var fin_integer = 0 + '%';
				}
				return fin_integer;
			});

			$('#org .planning span').text(function() {
				plan_weight = (($('#org .planning').height()) / orgheight) * (($('#organisation').height()) / 300);
				if (!$('#organisation').hasClass('zero')) {
					if ($('#org .financial').hasClass('zero')) {
						plan_integer = Math.round(($('#organisation').height() / 300) * 100) + '%';
					} else {
						plan_integer = Math.round(plan_weight * 100) + '%';
					}
				} else {

					plan_integer = 0 + '%';
				}
				return plan_integer;
			});

			actheight = 0;
			$('#act .weighting-category').each(function() {
				if (!$(this).hasClass('zero')) {
					actheight += $(this).height();
				}
			})
			$('#act .basic span').text(function() {
				itsweight = ($('#act .basic').height() / actheight) * ($('#activity').height() / 300);
				if (!$('#act .basic').hasClass('zero')) {
					its_integer = Math.round(itsweight * 100) + '%';
				} else {
					its_integer = 0 + '%';
				}
				return its_integer;

			})
			$('#act .classifications span').text(function() {
				itsweight = ($('#act .classifications').height() / actheight) * ($('#activity').height() / 300);
				if (!$('#act .classifications').hasClass('zero')) {
					its_integer = Math.round(itsweight * 100) + '%';
				} else {
					its_integer = 0 + '%';
				}
				return its_integer;

			})
			$('#act .related span').text(function() {
				itsweight = ($('#act .related').height() / actheight) * ($('#activity').height() / 300);
				if (!$('#act .related').hasClass('zero')) {
					its_integer = Math.round(itsweight * 100) + '%';
				} else {
					its_integer = 0 + '%';
				}
				return its_integer;

			})
			$('#act .financial span').text(function() {
				itsweight = ($('#act .financial').height() / actheight) * ($('#activity').height() / 300);
				if (!$('#act .financial').hasClass('zero')) {
					its_integer = Math.round(itsweight * 100) + '%';
				} else {
					its_integer = 0 + '%';
				}
				return its_integer;

			})
			$('#act .performance span').text(function() {
				itsweight = ($('#act .performance').height() / actheight) * ($('#activity').height() / 300);
				if (!$('#act .performance').hasClass('zero')) {
					its_integer = Math.round(itsweight * 100) + '%';
				} else {
					its_integer = 0 + '%';
				}
				return its_integer;

			})

			actheight2 = $('#act').height() - 8;
			if (act_orig_height > 10) {
				$("#act .classifications").height((actheight2) * class_o_percent);
				$("#act .financial").height((actheight2) * financial_o_percent);
				$("#act .related").height((actheight2) * related_o_percent);
				$("#act .performance").height((actheight2) * performance_o_percent);
				$("#act .basic").height((actheight2) * basic_o_percent);

				$('#act .weighting-category').each(function() {
					if ($(this).height() > 5) {
						$(this).removeClass('zero');
					}
				})
			} else {
				actdiff = $('#activity').height() - 8;
				$('#act .weighting-category').each(function() {
					$(this).height(actdiff * 0.2);
					if ($(this).height() > 5) {
						$(this).removeClass('zero');
					}
				})
			}
		},
		stop: function(event, ui) {
			totalheight = 0;
			$('#weightingtool-wrapper > .weighting-category').each(function() {
				if (!$(this).hasClass('zero')) {
					totalheight += $(this).height();
				}
			});
			$('#commitment span.percentage-reading').text(function() {
				cell1_weight = (($('.commitment').height()) / totalheight);
				if (!$('#commitment').hasClass('zero')) {
					cell1integer = Math.round(cell1_weight * 100) + '%';
				} else {
					cell1integer = 0 + '%';
				}
				return cell1integer;
			});
			commitment = cell1integer.substring(0, cell1integer.length - 1);
			$('#organisation span.percentage-reading').text(function() {
				cell2_weight = (($('.organisation').height()) / totalheight);
				if (!$('#organisation').hasClass('zero')) {
					var cell2integer = Math.round(cell2_weight * 100) + '%';
				} else {
					var cell2integer = 0 + '%';
				}
				return cell2integer;
			});

			$('#activity span.percentage-reading').text(function() {
				cell3_weight = (($('.activity').height()) / totalheight);
				if (!$('#activity').hasClass('zero')) {
					var cell3integer = Math.round(cell3_weight * 100) + '%';
				} else {
					var cell3integer = 0 + '%';
				}
				return cell3integer;
			});
			$('#commitment #com span').text(function() {
				cell1_weight = (($('.commitment').height()) / totalheight);
				if (!$('#commitment').hasClass('zero')) {
					var cell1integer = Math.round(cell1_weight * 100) + '%';
				} else {
					var cell1integer = 0 + '%';
				}
				return cell1integer;
			});

			orgheight = $('#org .financial').height() + $('#org .planning').height();

			$('#org .financial span').text(function() {
				fin_weight = (($('#org .financial').height()) / orgheight) * (($('#organisation').height()) / 300);
				if (orgheight == 0) {
					fin_integer = 0 + '%';
				} else {
					if (!$('#organisation').hasClass('zero')) {
						if ($('#org .planning').hasClass('zero')) {
							fin_integer = Math.round(($('#organisation').height() / 300) * 100) + '%';
						} else {
							fin_integer = Math.round(fin_weight * 100) + '%';
						}
					}
				}
				return fin_integer;
			});
			organisation_financial = fin_integer.substring(0, fin_integer.length - 1);
			$('#org .planning span').text(function() {
				plan_weight = (($('#org .planning').height()) / orgheight) * (($('#organisation').height()) / 300);
				if (orgheight == 0) {
					plan_integer = 0 + '%';
				} else {
					if (!$('#organisation').hasClass('zero')) {
						if ($('#org .financial').hasClass('zero')) {
							plan_integer = Math.round(($('#organisation').height() / 300) * 100) + '%';
						} else {
							plan_integer = Math.round(plan_weight * 100) + '%';
						}
					}
				}
				return plan_integer;
			});
			organisation_planning = plan_integer.substring(0, plan_integer.length - 1);

			if ($('#commitment').height() >= 298) {
				$('#commitment').animate({
					height: (280),
				}, 500, function() {});
				$('#organisation').animate({
					height: (10),
				}, 500, function() {});
				$('#organisation').addClass('zero');
				$('#activity').animate({
					height: (10),
				}, 500, function() {});
				$('#activity').addClass('zero');
				$('#act .weighting-category').each(function() {
					$(this).addClass('zero');
				});
			} else if ($('#commitment').height() == 0) {
				if (!$('#organisation').hasClass('zero')) {
					orgheight = $('#organisation').height() / 300;
					orgheight = orgheight * 290;
				} else {
					orgheight = 10;
				}
				if (!$('#activity').hasClass('zero')) {
					actheight = $('#activity').height() / 300;
					actheight = actheight * 290;
				} else {
					actheight = 10;
				}

				$('#organisation').animate({
					height: orgheight,
				}, 500, function() {});

				$('#activity').animate({
					height: actheight,
				}, 500, function() {});
				$('#commitment').animate({
					height: (10),
				}, 500, function() {});
				$('#commitment').addClass('zero');
			} else {
				$('#commitment').removeClass('zero');
			}

			actheight = 0;
			$('#act .weighting-category').each(function() {
				if (!$(this).hasClass('zero')) {
					actheight += $(this).height();
				}
			})
			$('#act .basic span').text(function() {
				itsweight1 = ($('#act .basic').height() / actheight) * ($('#activity').height() / 300);
				if (!$('#act .basic').hasClass('zero')) {
					its_integer = Math.round(itsweight1 * 100) + '%';
				} else {
					its_integer = 0 + '%';
				}
				return its_integer;
			})
			activity_basic = its_integer.substring(0, its_integer.length - 1);
			$('#act .classifications span').text(function() {
				itsweight2 = ($('#act .classifications').height() / actheight) * ($('#activity').height() / 300);
				if (!$('#act .classifications').hasClass('zero')) {
					its_integer = Math.round(itsweight2 * 100) + '%';
				} else {
					its_integer = 0 + '%';
				}
				return its_integer;
			})
			activity_classifications = its_integer.substring(0, its_integer.length - 1);
			$('#act .related span').text(function() {
				itsweight3 = ($('#act .related').height() / actheight) * ($('#activity').height() / 300);
				if (!$('#act .related').hasClass('zero')) {
					its_integer = Math.round(itsweight3 * 100) + '%';
				} else {
					its_integer = 0 + '%';
				}
				return its_integer;
			})
			activity_related_documents = its_integer.substring(0, its_integer.length - 1);
			$('#act .financial span').text(function() {
				itsweight4 = ($('#act .financial').height() / actheight) * ($('#activity').height() / 300);
				if (!$('#act .financial').hasClass('zero')) {
					its_integer = Math.round(itsweight4 * 100) + '%';
				} else {
					its_integer = 0 + '%';
				}
				return its_integer;
			})
			activity_financial = its_integer.substring(0, its_integer.length - 1);
			$('#act .performance span').text(function() {
				itsweight5 = ($('#act .performance').height() / actheight) * ($('#activity').height() / 300);
				if (!$('#act .performance').hasClass('zero')) {
					its_integer = Math.round(itsweight5 * 100) + '%';
				} else {
					its_integer = 0 + '%';
				}
				return its_integer;
			})
			activity_performance = its_integer.substring(0, its_integer.length - 1);

			orgsubheight = $('#org .planning').height() + $('#org .financial').height();
			orgheight = $('#organisation').height();
			orgfinheightpercent = $('#org .financial').height() / orgsubheight;
			orgplanheightpercent = $('#org .planning').height() / orgsubheight;
			$('#org .financial').animate({
				height: (orgheight * orgfinheightpercent),
			}, 500, function() {});
			$('#org .planning').animate({
				height: (orgheight * orgplanheightpercent),
			}, 500, function() {});
			totalheight = 0;
			$('#weightingtool-wrapper > .weighting-category').each(function() {
				if (!$(this).hasClass('zero')) {
					totalheight += $(this).height();
				}
			});
			orgheight1 = $('#organisation').height()
			if ($('#org .financial').height() == 0) {

				planningheight = orgheight1 - 5;

				$('#org .planning').animate({
					height: (planningheight),
				}, 500, function() {});

				$('#org .financial').animate({
					height: (5),
				}, 500, function() {});
				$('#org .financial').addClass('zero');
			}
			if ($('#org .planning').height() == 0) {

				planningheight = orgheight1 - 5;

				$('#org .financial').animate({
					height: (planningheight),
				}, 500, function() {});

				$('#org .planning').animate({
					height: (5),
				}, 500, function() {});
				$('#org .planning').addClass('zero');
			}
		}
	});

	$('#organisation').resizable(
	{
		minHeight: 0,
		maxHeight: 300,
		handles: 's',
		grid: 3,
		start: function(event, ui) 
		{
			$('.weightingbtn').each(function() 
			{
				$(this).addClass('enabled');
			});
			com_orig_height2 			= $(this).height();
			org_orig_height 			= $("#organisation").height();
			act_orig_height 			= $("#activity").height();
			com_orig_height_percentage 	= $("#commitment").height() / (300 - $('#organisation').height());
			act_orig_height_percentage2 = $("#activity").height() / (300 - $('#organisation').height());
			orgfin_orig_percentage 		= $('#org .financial').height() / $('#org').height();
			orgplan_orig_percentage 	= $('#org .planning').height() / $('#org').height();

			actheight1 = 0;
			$('#act .weighting-category').each(function() 
			{
				actheight1 += $(this).height();
			})
			basic_o_percent 		= $('#act .basic').height() / (actheight1);
			class_o_percent 		= $('#act .classifications').height() / (actheight1);
			related_o_percent 		= $('#act .related').height() / (actheight1);
			financial_o_percent 	= $('#act .financial').height() / (actheight1);
			performance_o_percent 	= $('#act .performance').height() / (actheight1);
		},
		resize: function(event, ui) 
		{
			orgheight = $('#org .financial').height() + $('#org .planning').height();
			$('#org .financial span').text(function() 
			{
				fin_weight = (($('#org .financial').height()) / orgheight) * (($('#organisation').height()) / 300);
				if (orgheight == 0) 
				{
					var fin_integer = 0 + '%';
				} 
				else 
				{
					if (!$('#organisation').hasClass('zero')) 
					{
						if ($('#org .planning').hasClass('zero')) 
						{
							var fin_integer = Math.round(($('#organisation').height() / 300) * 100) + '%';
						} 
						else 
						{
							var fin_integer = Math.round(fin_weight * 100) + '%';
						}
					}
				}
				return fin_integer;
			});
			$('#org .planning span').text(function() 
			{
				fin_weight = (($('#org .planning').height()) / orgheight) * (($('#organisation').height()) / 300);
				if (orgheight == 0) 
				{
					plan_integer = 0 + '%';
				} 
				else 
				{
					if (!$('#organisation').hasClass('zero')) 
					{
						if ($('#org .financial').hasClass('zero')) 
						{
							plan_integer = Math.round(($('#organisation').height() / 300) * 100) + '%';
						} 
						else 
						{
							plan_integer = Math.round(fin_weight * 100) + '%';
						}
					}
				}
				return plan_integer;
			});

			if ($('#organisation').height() > com_orig_height2 || com_orig_height2 < 298) 
			{
				$("#activity").height((300 - $('#organisation').height()) * act_orig_height_percentage2);
				$("#commitment").height((300 - $('#organisation').height()) * com_orig_height_percentage);
			} 
			else 
			{
				$("#activity").height((300 - $('#organisation').height()) * 0.5);
				$("#commitment").height((300 - $('#organisation').height()) * 0.5);
			}
			
			if (org_orig_height > 10) 
			{
				$('#org .financial').height($('#org').height() * orgfin_orig_percentage);
				$('#org .planning').height($('#org').height() * orgplan_orig_percentage);
				
				if ($('#org .planning').height() > 10) 
				{
					$('#org .planning').removeClass('zero');
				}
				
				if ($('#org .financial').height() > 10) 
				{
					$('#org .financial').removeClass('zero');
				}
			} 
			else 
			{
				orgdiff = $('#organisation').height();
				$('#org .financial').height(orgdiff * 0.5);
				$('#org .planning').height(orgdiff * 0.5);
				if ($('#org .planning').height() > 10) 
				{
					$('#org .planning').removeClass('zero');
				}
				if ($('#org .financial').height() > 10) 
				{
					$('#org .financial').removeClass('zero');
				}
			}

			totalheight = 0;
			$('#weightingtool-wrapper > .weighting-category').each(function() 
			{
				if (!$(this).hasClass('zero')) 
				{
					totalheight += $(this).height();
				}
			});
			
			if ($('#activity').height() > 10) 
			{
				$('#activity').removeClass('zero');
			}
			
			if ($('#commitment').height() > 10) 
			{
				$('#commitment').removeClass('zero');
			}
			
			if ($('#organisation').height() > 10) 
			{
				$('#organisation').removeClass('zero');
			}
			
			var cell1_weight;
			var cell2_weight;
			var cell3_weight;
			
			$('#commitment span.percentage-reading').text(function() 
			{
				cell1_weight = (($('.commitment').height()) / totalheight);
				if (!$('#commitment').hasClass('zero')) 
				{
					var cell1integer = Math.round(cell1_weight * 100) + '%';
				} 
				else 
				{
					var cell1integer = 0 + '%';
				}
				return cell1integer;
			});
			
			$('#commitment #com span').text(function() 
			{
				cell1_weight = (($('.commitment').height()) / totalheight);
				if (!$('#commitment').hasClass('zero')) 
				{
					var cell1integer = Math.round(cell1_weight * 100) + '%';
				} 
				else 
				{
					var cell1integer = 0 + '%';
				}
				return cell1integer;
			});
			
			$('#organisation span.percentage-reading').text(function() 
			{
				cell2_weight = (($('.organisation').height()) / totalheight);
				if (!$('#organisation').hasClass('zero')) 
				{
					var cell2integer = Math.round(cell2_weight * 100) + '%';
				} 
				else 
				{
					var cell2integer = 0 + '%';
				}
				return cell2integer;
			});

			$('#activity span.percentage-reading').text(function() 
			{
				cell3_weight = (($('.activity').height()) / totalheight);
				if (!$('#activity').hasClass('zero')) 
				{
					var cell3integer = Math.round(cell3_weight * 100) + '%';
				} 
				else 
				{
					var cell3integer = 0 + '%';
				}
				return cell3integer;
			});

			actheight = 0;
			
			$('#act .weighting-category').each(function() 
			{
				if (!$(this).hasClass('zero')) 
				{
					actheight += $(this).height();
				}
			})
			
			$('#act .basic span').text(function() 
			{
				itsweight = ($('#act .basic').height() / actheight) * ($('#activity').height() / 300);
				if (!$('#act .basic').hasClass('zero')) 
				{
					its_integer = Math.round(itsweight * 100) + '%';
				} else 
				{
					its_integer = 0 + '%';
				}
				return its_integer;

			})
			
			$('#act .classifications span').text(function() 
			{
				itsweight = ($('#act .classifications').height() / actheight) * ($('#activity').height() / 300);
				if (!$('#act .classifications').hasClass('zero')) 
				{
					its_integer = Math.round(itsweight * 100) + '%';
				} 
				else 
				{
					its_integer = 0 + '%';
				}
				return its_integer;
			})

			$('#act .related span').text(function() 
			{
				itsweight = ($('#act .related').height() / actheight) * ($('#activity').height() / 300);
				if (!$('#act .related').hasClass('zero')) 
				{
					its_integer = Math.round(itsweight * 100) + '%';
				} 
				else 
				{
					its_integer = 0 + '%';
				}
				return its_integer;
			})

			$('#act .financial span').text(function() 
			{
				itsweight = ($('#act .financial').height() / actheight) * ($('#activity').height() / 300);
				if (!$('#act .financial').hasClass('zero')) {
					its_integer = Math.round(itsweight * 100) + '%';
				} 
				else 
				{
					its_integer = 0 + '%';
				}
				return its_integer;
			})

			$('#act .performance span').text(function() 
			{
				itsweight = ($('#act .performance').height() / actheight) * ($('#activity').height() / 300);
				if (!$('#act .performance').hasClass('zero')) 
				{
					its_integer = Math.round(itsweight * 100) + '%';
				} 
				else 
				{
					its_integer = 0 + '%';
				}
				return its_integer;
			})

			actheight2 = $('#act').height() - 8;

			if (act_orig_height > 10) 
			{
				$("#act .classifications").height((actheight2) * class_o_percent);
				$("#act .financial").height((actheight2) * financial_o_percent);
				$("#act .related").height((actheight2) * related_o_percent);
				$("#act .performance").height((actheight2) * performance_o_percent);
				$("#act .basic").height((actheight2) * basic_o_percent);

				$('#act .weighting-category').each(function() 
				{
					if ($(this).height() > 5) 
					{
						$(this).removeClass('zero');
					}
				})
			} 
			else 
			{
				actdiff = $('#activity').height() - 8;
				
				$('#act .weighting-category').each(function() 
				{
					$(this).height(actdiff * 0.2);
					if ($(this).height() > 5) 
					{
						$(this).removeClass('zero');
					}
				})
			}
		},
		stop: function(event, ui) 
		{
			totalheight = 0;
			
			$('#weightingtool-wrapper > .weighting-category').each(function() 
			{
				if (!$(this).hasClass('zero')) 
				{
					totalheight += $(this).height();
				}
			});
			
			$('#commitment span.percentage-reading').text(function() 
			{
				cell1_weight = (($('.commitment').height()) / totalheight);
				if (!$('#commitment').hasClass('zero')) 
				{
					cell1integer = Math.round(cell1_weight * 100) + '%';
				} 
				else 
				{
					cell1integer = 0 + '%';
				}
				return cell1integer;
			});

			commitment = cell1integer.substring(0, cell1integer.length - 1);
			
			$('#organisation span.percentage-reading').text(function() 
			{
				cell2_weight = (($('.organisation').height()) / totalheight);
				if (!$('#organisation').hasClass('zero')) 
				{
					var cell2integer = Math.round(cell2_weight * 100) + '%';
				} 
				else 
				{
					var cell2integer = 0 + '%';
				}
				return cell2integer;
			});

			$('#activity span.percentage-reading').text(function() 
			{
				cell3_weight = (($('.activity').height()) / totalheight);
				if (!$('#activity').hasClass('zero')) 
				{
					var cell3integer = Math.round(cell3_weight * 100) + '%';
				} 
				else 
				{
					var cell3integer = 0 + '%';
				}
				return cell3integer;
			});
			
			$('#commitment #com span').text(function() 
			{
				cell1_weight = (($('.commitment').height()) / totalheight);
				if (!$('#commitment').hasClass('zero')) 
				{
					var cell1integer = Math.round(cell1_weight * 100) + '%';
				} 
				else 
				{
					var cell1integer = 0 + '%';
				}
				return cell1integer;
			});

			orgheight = $('#org .financial').height() + $('#org .planning').height();

			$('#org .financial span').text(function() 
			{
				fin_weight = (($('#org .financial').height()) / orgheight) * (($('#organisation').height()) / 300);
				if (orgheight == 0) 
				{
					fin_integer = 0 + '%';
				} 
				else 
				{
					if (!$('#organisation').hasClass('zero')) 
					{
						if ($('#org .planning').hasClass('zero')) 
						{
							fin_integer = Math.round(($('#organisation').height() / 300) * 100) + '%';
						} 
						else 
						{
							fin_integer = Math.round(fin_weight * 100) + '%';
						}
					}
				}
				return fin_integer;
			});

			organisation_financial = fin_integer.substring(0, fin_integer.length - 1);
			
			$('#org .planning span').text(function() 
			{
				plan_weight = (($('#org .planning').height()) / orgheight) * (($('#organisation').height()) / 300);
				if (orgheight == 0) 
				{
					plan_integer = 0 + '%';
				} 
				else 
				{
					if (!$('#organisation').hasClass('zero')) 
					{
						if ($('#org .financial').hasClass('zero')) 
						{
							plan_integer = Math.round(($('#organisation').height() / 300) * 100) + '%';
						} 
						else 
						{
							plan_integer = Math.round(plan_weight * 100) + '%';
						}
					}
				}
				return plan_integer;
			});

			organisation_planning = plan_integer.substring(0, plan_integer.length - 1);

			actheight = 0;
			$('#act .weighting-category').each(function() 
			{
				if (!$(this).hasClass('zero')) 
				{
					actheight += $(this).height();
				}
			})

			totalheight = 0;
			
			$('#weightingtool-wrapper > .weighting-category').each(function() 
			{
				if (!$(this).hasClass('zero')) 
				{
					totalheight += $(this).height();
				}
			});
			
			orgsubheight = $('#org .planning').height() + $('#org .financial').height();
			
			if ($('#organisation').height() >= 298) 
			{
				$('#organisation').animate({
					height: (280),
				}, 500, function() {});

				orgfinheightpercent = $('#org .financial').height() / orgsubheight;
				orgplanheightpercent = $('#org .planning').height() / orgsubheight;
				
				$('#org .financial').animate({
					height: (280 * orgfinheightpercent),
				}, 500, function() {});
				
				$('#org .planning').animate({
					height: (280 * orgplanheightpercent),
				}, 500, function() {});
				
				$('#commitment').animate({
					height: (10),
				}, 500, function() {});
				
				$('#commitment').addClass('zero');
				
				$('#activity').animate({
					height: (10),
				}, 500, function() {});
				
				$('#activity').addClass('zero');
				
				$('#act .weighting-category').each(function() 
				{
					$(this).addClass('zero');
				});
			} 
			else if ($('#organisation').height() == 0) 
			{
				if (!$('#activity').hasClass('zero')) 
				{
					actheight = $('#activity').height() / 300;
					actheight = actheight * 290;
				} 
				else 
				{
					actheight = 10;
				}
				if (!$('#commitment').hasClass('zero')) 
				{
					comheight = $('#commitment').height() / 300;
					comheight = comheight * 290;
				} 
				else 
				{
					comheight = 10;
				}

				$('#commitment').animate({
					height: comheight,
				}, 500, function() {});

				$('#activity').animate({
					height: actheight,
				}, 500, function() {});
				
				$('#organisation').animate({
					height: (10),
				}, 500, function() {});
				
				$('#organisation').addClass('zero');
			} 
			else 
			{
				$('#organisation').removeClass('zero');
			}

			orgheight1 = $('#organisation').height()
			
			if ($('#org .financial').height() == 0) 
			{
				planningheight = orgheight1 - 5;

				$('#org .planning').animate({
					height: (planningheight),
				}, 500, function() {});

				$('#org .financial').animate({
					height: (5),
				}, 500, function() {});

				$('#org .financial').addClass('zero');
			}

			if ($('#org .planning').height() == 0) 
			{
				planningheight = orgheight1 - 5;

				$('#org .financial').animate({
					height: (planningheight),
				}, 500, function() {});

				$('#org .planning').animate({
					height: (5),
				}, 500, function() {});

				$('#org .planning').addClass('zero');
			}

			$('#act .basic span').text(function() 
			{
				itsweight1 = ($('#act .basic').height() / actheight) * ($('#activity').height() / 300);
				if (!$('#act .basic').hasClass('zero')) 
				{
					its_integer = Math.round(itsweight1 * 100) + '%';
				} 
				else 
				{
					its_integer = 0 + '%';
				}
				return its_integer;
			})
			
			activity_basic = its_integer.substring(0, its_integer.length - 1);
			
			$('#act .classifications span').text(function() 
			{
				itsweight2 = ($('#act .classifications').height() / actheight) * ($('#activity').height() / 300);
				if (!$('#act .classifications').hasClass('zero')) 
				{
					its_integer = Math.round(itsweight2 * 100) + '%';
				} 
				else 
				{
					its_integer = 0 + '%';
				}
				return its_integer;
			})

			activity_classifications = its_integer.substring(0, its_integer.length - 1);
			
			$('#act .related span').text(function() {
				itsweight3 = ($('#act .related').height() / actheight) * ($('#activity').height() / 300);
				if (!$('#act .related').hasClass('zero')) {
					its_integer = Math.round(itsweight3 * 100) + '%';
				} else {
					its_integer = 0 + '%';
				}
				return its_integer;
			})
			
			activity_related_documents = its_integer.substring(0, its_integer.length - 1);
			
			$('#act .financial span').text(function() 
			{
				itsweight4 = ($('#act .financial').height() / actheight) * ($('#activity').height() / 300);
				if (!$('#act .financial').hasClass('zero')) 
				{
					its_integer = Math.round(itsweight4 * 100) + '%';
				} 
				else 
				{
					its_integer = 0 + '%';
				}
				return its_integer;
			})

			activity_financial = its_integer.substring(0, its_integer.length - 1);

			$('#act .performance span').text(function() 
			{
				itsweight5 = ($('#act .performance').height() / actheight) * ($('#activity').height() / 300);
				if (!$('#act .performance').hasClass('zero')) 
				{
					its_integer = Math.round(itsweight5 * 100) + '%';
				} 
				else 
				{
					its_integer = 0 + '%';
				}
				return its_integer;
			})

			activity_performance = its_integer.substring(0, its_integer.length - 1);
		}
	});

	orgheight = $('#organisation').height();
	$('#org .planning').resizable(
	{
		grid: 3,
		minHeight: 0,
		handles: 's',
		start: function(event, ui) 
		{
			orgheight = $('#organisation').height();
			$('.weightingbtn').each(function() 
			{
				$(this).addClass('enabled');
			});
		},
		resize: function(event, ui) 
		{
			$("#org .financial").height($('#org').height() - $('#org .planning').height());
			
			if ($('#org .planning').height() > 10) 
			{
				$('#org .planning').removeClass('zero');
			}
			
			if ($('#org .financial').height() > 10) 
			{
				$('#org .financial').removeClass('zero');
			}
			
			totalheight = $('#org .financial').height() + $('#org .planning').height();
			
			$('#org .weighting-category').each(function() 
			{
				if ($(this).hasClass('zero')) 
				{
					totalheight -= 10;
				}
			})
			
			$('#org .financial span').text(function() 
			{
				fin_weight = (($('#org .financial').height()) / totalheight) * (($('#organisation').height()) / 300);
				if (!$('#org .financial span').hasClass('zero')) {
					var fin_integer = Math.round(fin_weight * 100) + '%';
				} 
				else 
				{
					var fin_integer = 0 + '%';
				}
				return fin_integer;
			});

			$('#org .planning span').text(function() 
			{
				plan_weight = (($('#org .planning').height()) / totalheight) * (($('#organisation').height()) / 300);
				if (!$('#org .planning').hasClass('zero')) 
				{
					plan_integer = Math.round(plan_weight * 100) + '%';
				} 
				else 
				{
					plan_integer = 0 + '%';
				}
				return plan_integer;
			});
		},
		stop: function(event, ui) 
		{
			totalheight = 0;
			$('#weightingtool-wrapper > .weighting-category').each(function() 
			{
				if (!$(this).hasClass('zero')) 
				{
					totalheight += $(this).height();
				}
			});
			
			$('#commitment span.percentage-reading').text(function() 
			{
				cell1_weight = (($('.commitment').height()) / totalheight);
				if (!$('#commitment').hasClass('zero')) 
				{
					cell1integer = Math.round(cell1_weight * 100) + '%';
				} 
				else 
				{
					cell1integer = 0 + '%';
				}
				return cell1integer;
			});
			
			commitment = cell1integer.substring(0, cell1integer.length - 1);
			
			$('#organisation span.percentage-reading').text(function() 
			{
				cell2_weight = (($('.organisation').height()) / totalheight);
				if (!$('#organisation').hasClass('zero')) 
				{
					var cell2integer = Math.round(cell2_weight * 100) + '%';
				} 
				else 
				{
					var cell2integer = 0 + '%';
				}
				return cell2integer;
			});

			$('#activity span.percentage-reading').text(function() 
			{
				cell3_weight = (($('.activity').height()) / totalheight);
				if (!$('#activity').hasClass('zero')) 
				{
					var cell3integer = Math.round(cell3_weight * 100) + '%';
				} 
				else 
				{
					var cell3integer = 0 + '%';
				}
				return cell3integer;
			});
			
			$('#commitment #com span').text(function() 
			{
				cell1_weight = (($('.commitment').height()) / totalheight);
				if (!$('#commitment').hasClass('zero')) 
				{
					var cell1integer = Math.round(cell1_weight * 100) + '%';
				} 
				else 
				{
					var cell1integer = 0 + '%';
				}
				return cell1integer;
			});

			orgheight = $('#org .financial').height() + $('#org .planning').height();
			
			$('#org .weighting-category').each(function() 
			{
				if ($(this).hasClass('zero')) 
				{
					orgheight -= 10;
				}
			})
			
			totalheight = 300;
			$('.parent').each(function() 
			{
				if ($(this).hasClass('zero')) 
				{
					totalheight -= 10;
				}
			})
			
			console.log(totalheight);
			
			$('#org .financial span').text(function() 
			{
				fin_weight = (($('#org .financial').height()) / orgheight) * (($('#organisation').height()) / totalheight);
				if (orgheight == 0) 
				{
					fin_integer = 0 + '%';
				} 
				else 
				{
					if (!$('#organisation').hasClass('zero')) 
					{
						if ($('#org .planning').hasClass('zero')) 
						{
							fin_integer = Math.round(($('#organisation').height() / totalheight) * 100) + '%';
						} 
						else 
						{
							fin_integer = Math.round(fin_weight * 100) + '%';
						}
					}
				}
				return fin_integer;
			});

			organisation_financial = fin_integer.substring(0, fin_integer.length - 1);
			
			$('#org .planning span').text(function() 
			{
				plan_weight = (($('#org .planning').height()) / orgheight) * (($('#organisation').height()) / totalheight);
				
				if (orgheight == 0) 
				{
					plan_integer = 0 + '%';
				} 
				else 
				{
					if (!$('#organisation').hasClass('zero')) 
					{
						if ($('#org .financial').hasClass('zero')) 
						{
							plan_integer = Math.round(($('#organisation').height() / totalheight) * 100) + '%';
						} 
						else 
						{
							plan_integer = Math.round(plan_weight * 100) + '%';
						}
					}
				}
				return plan_integer;
			});
			
			organisation_planning = plan_integer.substring(0, plan_integer.length - 1);
			actheight = 0;
			
			$('#act .weighting-category').each(function() 
			{
				if (!$(this).hasClass('zero')) 
				{
					actheight += $(this).height();
				}
			})

			$('#act .basic span').text(function() 
			{
				itsweight1 = ($('#act .basic').height() / actheight) * ($('#activity').height() / 300);
				
				if (!$('#act .basic').hasClass('zero')) 
				{
					its_integer = Math.round(itsweight1 * 100) + '%';
				} 
				else 
				{
					its_integer = 0 + '%';
				}
				return its_integer;
			})

			activity_basic = its_integer.substring(0, its_integer.length - 1);
			
			$('#act .classifications span').text(function() 
			{
				itsweight2 = ($('#act .classifications').height() / actheight) * ($('#activity').height() / 300);
				
				if (!$('#act .classifications').hasClass('zero')) 
				{
					its_integer = Math.round(itsweight2 * 100) + '%';
				} 
				else 
				{
					its_integer = 0 + '%';
				}
				return its_integer;
			})

			activity_classifications = its_integer.substring(0, its_integer.length - 1);
			
			$('#act .related span').text(function() 
			{
				itsweight3 = ($('#act .related').height() / actheight) * ($('#activity').height() / 300);
				
				if (!$('#act .related').hasClass('zero')) 
				{
					its_integer = Math.round(itsweight3 * 100) + '%';
				} 
				else 
				{
					its_integer = 0 + '%';
				}
				return its_integer;
			})
			
			activity_related_documents = its_integer.substring(0, its_integer.length - 1);
			
			$('#act .financial span').text(function() 
			{
				itsweight4 = ($('#act .financial').height() / actheight) * ($('#activity').height() / 300);
				
				if (!$('#act .financial').hasClass('zero')) 
				{
					its_integer = Math.round(itsweight4 * 100) + '%';
				} 
				else 
				{
					its_integer = 0 + '%';
				}
				return its_integer;
			})

			activity_financial = its_integer.substring(0, its_integer.length - 1);

			$('#act .performance span').text(function() 
			{
				itsweight5 = ($('#act .performance').height() / actheight) * ($('#activity').height() / 300);
				
				if (!$('#act .performance').hasClass('zero')) 
				{
					its_integer = Math.round(itsweight5 * 100) + '%';
				} else {
					its_integer = 0 + '%';
				}
				return its_integer;
			})
		
			activity_performance = its_integer.substring(0, its_integer.length - 1);
			orgheight = $('#organisation').height();
		
			if ($('#org .financial').height() == 0) {

				planningheight = orgheight - 12;

				$('#org .planning').animate({
					height: (planningheight),
				}, 500, function() {});

				console.log(planningheight);

				$('#org .financial').animate({
					height: (10),
				}, 500, function() {});

				$('#org .financial').addClass('zero');
			}
			
			if ($('#org .planning').height() == 0) 
			{

				planningheight = orgheight - 12;

				$('#org .financial').animate({
					height: (planningheight),
				}, 500, function() {});

				$('#org .planning').animate({
					height: (10),
				}, 500, function() {});
				$('#org .planning').addClass('zero');
			}
			orgheight = $('#organisation').height();
		}
	});
	
	$('#act .weighting-category').resizable(
	{
		grid: 3,
		minHeight: 0,
		handles: 's',
		start: function(event, ui) {
			$('.weightingbtn').each(function() 
			{
				$(this).addClass('enabled');
			});
			
			orig_height = $(this).height();
			actheight1 = $('#activity').height() - 8;
			
			$('#act .weighting-category').each(function() 
			{
				if ($(this).hasClass('zero')) 
				{
					actheight1 -= 10;
				}
			})
			basic_o_percent 		= $('#act .basic').height() / (actheight1 - $(this).height());
			class_o_percent 		= $('#act .classifications').height() / (actheight1 - $(this).height());
			related_o_percent 		= $('#act .related').height() / (actheight1 - $(this).height());
			financial_o_percent 	= $('#act .financial').height() / (actheight1 - $(this).height());
			performance_o_percent 	= $('#act .performance').height() / (actheight1 - $(this).height());

		},
		resize: function(event, ui) 
		{
			if ($(this).hasClass('zero') && $(this).height() > 5) 
			{
				$(this).removeClass('zero');
			}
			if (!$(this).hasClass('zero')) 
			{

				if ($(this).height() > orig_height || orig_height < (actheight1)) 
				{

					if ($(this).attr('id') == 'basic') 
					{
						$("#act .classifications").height((actheight1 - $(this).height()) * class_o_percent);
						$("#act .financial").height((actheight1 - $(this).height()) * financial_o_percent);
						$("#act .related").height((actheight1 - $(this).height()) * related_o_percent);
						$("#act .performance").height((actheight1 - $(this).height()) * performance_o_percent);
					} 
					else if ($(this).attr('id') == 'classifications') 
					{
						$("#act .basic").height((actheight1 - $(this).height()) * basic_o_percent);
						$("#act .financial").height((actheight1 - $(this).height()) * financial_o_percent);
						$("#act .related").height((actheight1 - $(this).height()) * related_o_percent);
						$("#act .performance").height((actheight1 - $(this).height()) * performance_o_percent);
					} 
					else if ($(this).attr('id') == 'financial') 
					{
						$("#act .classifications").height((actheight1 - $(this).height()) * class_o_percent);
						$("#act .basic").height((actheight1 - $(this).height()) * basic_o_percent);
						$("#act .related").height((actheight1 - $(this).height()) * related_o_percent);
						$("#act .performance").height((actheight1 - $(this).height()) * performance_o_percent);
					} 
					else if ($(this).attr('id') == 'related') 
					{
						$("#act .classifications").height((actheight1 - $(this).height()) * class_o_percent);
						$("#act .financial").height((actheight1 - $(this).height()) * financial_o_percent);
						$("#act .basic").height((actheight1 - $(this).height()) * basic_o_percent);
						$("#act .performance").height((actheight1 - $(this).height()) * performance_o_percent);
					} 
					else if ($(this).attr('id') == 'performance') 
					{
						$("#act .classifications").height((actheight1 - $(this).height()) * class_o_percent);
						$("#act .financial").height((actheight1 - $(this).height()) * financial_o_percent);
						$("#act .related").height((actheight1 - $(this).height()) * related_o_percent);
						$("#act .basic").height((actheight1 - $(this).height()) * basic_o_percent);
					}

				} 
				else 
				{
					actheight2 = $('#activity').height() - 8;
					targetheight = $(this).height();
					
					$('#act .weighting-category').not(this).each(function() 
					{
						$(this).height((actheight2 - targetheight) * 0.25);
						if ($(this).hasClass('zero') && $(this).height() > 0) 
						{
							$(this).removeClass('zero');
						}
					})
				}
			}

			actheight = $('#activity').height() - 8;

			$('#act .basic span').text(function() 
			{
				itsweight = ($('#act .basic').height() / actheight) * ($('#activity').height() / 300);
				
				if (!$('#act .basic').hasClass('zero')) 
				{
					its_integer = Math.round(itsweight * 100) + '%';
				} 
				else 
				{
					its_integer = 0 + '%';
				}
				return its_integer;
			})

			$('#act .classifications span').text(function() 
			{
				itsweight = ($('#act .classifications').height() / actheight) * ($('#activity').height() / 300);
				
				if (!$('#act .classifications').hasClass('zero')) 
				{
					its_integer = Math.round(itsweight * 100) + '%';
				} 
				else 
				{
					its_integer = 0 + '%';
				}
				return its_integer;
			})

			$('#act .related span').text(function() 
			{
				itsweight = ($('#act .related').height() / actheight) * ($('#activity').height() / 300);
				if (!$('#act .related').hasClass('zero')) 
				{
					its_integer = Math.round(itsweight * 100) + '%';
				} 
				else 
				{
					its_integer = 0 + '%';
				}
				return its_integer;
			})

			$('#act .financial span').text(function() 
			{
				itsweight = ($('#act .financial').height() / actheight) * ($('#activity').height() / 300);
				if (!$('#act .financial').hasClass('zero')) 
				{
					its_integer = Math.round(itsweight * 100) + '%';
				} 
				else 
				{
					its_integer = 0 + '%';
				}
				return its_integer;
			})

			$('#act .performance span').text(function() 
			{
				itsweight = ($('#act .performance').height() / actheight) * ($('#activity').height() / 300);
				if (!$('#act .performance').hasClass('zero')) 
				{
					its_integer = Math.round(itsweight * 100) + '%';
				} 
				else 
				{
					its_integer = 0 + '%';
				}
				return its_integer;
			})
		},
		stop: function(event, ui) 
		{
			if ($(this).height() == 0) 
			{
				$(this).addClass('zero');
			}
			
			totalheight = 0;
			
			$('#weightingtool-wrapper > .weighting-category').each(function() 
			{
				if (!$(this).hasClass('zero')) 
				{
					totalheight += $(this).height();
				}
			});

			$('#commitment span.percentage-reading').text(function() 
			{
				cell1_weight = (($('.commitment').height()) / totalheight);
				
				if (!$('#commitment').hasClass('zero')) 
				{
					cell1integer = Math.round(cell1_weight * 100) + '%';
				} 
				else
				{
					cell1integer = 0 + '%';
				}
				return cell1integer;
			});

			commitment = cell1integer.substring(0, cell1integer.length - 1);
			
			$('#organisation span.percentage-reading').text(function() 
			{
				cell2_weight = (($('.organisation').height()) / totalheight);
				if (!$('#organisation').hasClass('zero')) 
				{
					var cell2integer = Math.round(cell2_weight * 100) + '%';
				} 
				else 
				{
					var cell2integer = 0 + '%';
				}
				return cell2integer;
			});

			$('#activity span.percentage-reading').text(function() 
			{
				cell3_weight = (($('.activity').height()) / totalheight);
				if (!$('#activity').hasClass('zero')) 
				{
					var cell3integer = Math.round(cell3_weight * 100) + '%';
				} 
				else 
				{
					var cell3integer = 0 + '%';
				}
				return cell3integer;
			});

			$('#commitment #com span').text(function() 
			{
				cell1_weight = (($('.commitment').height()) / totalheight);
				
				if (!$('#commitment').hasClass('zero')) 
				{
					var cell1integer = Math.round(cell1_weight * 100) + '%';
				} 
				else 
				{
					var cell1integer = 0 + '%';
				}
				return cell1integer;
			});

			orgheight = $('#org .financial').height() + $('#org .planning').height();

			$('#org .financial span').text(function() 
			{
				fin_weight = (($('#org .financial').height()) / orgheight) * (($('#organisation').height()) / 300);
				
				if (orgheight == 0) 
				{
					fin_integer = 0 + '%';
				} 
				else 
				{
					if (!$('#organisation').hasClass('zero')) 
					{
						if ($('#org .planning').hasClass('zero')) 
						{
							fin_integer = Math.round(($('#organisation').height() / 300) * 100) + '%';
						} 
						else 
						{
							fin_integer = Math.round(fin_weight * 100) + '%';
						}
					}
				}
				return fin_integer;
			});

			organisation_financial = fin_integer.substring(0, fin_integer.length - 1);
			
			$('#org .planning span').text(function() 
			{
				plan_weight = (($('#org .planning').height()) / orgheight) * (($('#organisation').height()) / 300);
				if (orgheight == 0) 
				{
					plan_integer = 0 + '%';
				} 
				else 
				{
					if (!$('#organisation').hasClass('zero')) 
					{
						if ($('#org .financial').hasClass('zero')) 
						{
							plan_integer = Math.round(($('#organisation').height() / 300) * 100) + '%';
						} 
						else 
						{
							plan_integer = Math.round(plan_weight * 100) + '%';
						}
					}
				}
				return plan_integer;
			});

			organisation_planning = plan_integer.substring(0, plan_integer.length - 1);

			actheight = 0;
			$('#act .weighting-category').each(function() 
			{
				if (!$(this).hasClass('zero')) 
				{
					actheight += $(this).height();
				}
			})

			$('#act .basic span').text(function() 
			{
				itsweight1 = ($('#act .basic').height() / actheight) * ($('#activity').height() / 300);
				if (!$('#act .basic').hasClass('zero')) 
				{
					its_integer = Math.round(itsweight1 * 100) + '%';
				} 
				else 
				{
					its_integer = 0 + '%';
				}
				return its_integer;
			})

			activity_basic = its_integer.substring(0, its_integer.length - 1);

			$('#act .classifications span').text(function() 
			{
				itsweight2 = ($('#act .classifications').height() / actheight) * ($('#activity').height() / 300);
				
				if (!$('#act .classifications').hasClass('zero')) 
				{
					its_integer = Math.round(itsweight2 * 100) + '%';
				} 
				else 
				{
					its_integer = 0 + '%';
				}
				return its_integer;
			})

			activity_classifications = its_integer.substring(0, its_integer.length - 1);

			$('#act .related span').text(function() 
			{
				itsweight3 = ($('#act .related').height() / actheight) * ($('#activity').height() / 300);

				if (!$('#act .related').hasClass('zero')) 
				{
					its_integer = Math.round(itsweight3 * 100) + '%';
				} 
				else 
				{
					its_integer = 0 + '%';
				}
				return its_integer;
			})

			activity_related_documents = its_integer.substring(0, its_integer.length - 1);
			
			$('#act .financial span').text(function() 
			{
				itsweight4 = ($('#act .financial').height() / actheight) * ($('#activity').height() / 300);
				if (!$('#act .financial').hasClass('zero')) 
				{
					its_integer = Math.round(itsweight4 * 100) + '%';
				} 
				else 
				{
					its_integer = 0 + '%';
				}
				return its_integer;
			})

			activity_financial = its_integer.substring(0, its_integer.length - 1);

			$('#act .performance span').text(function() 
			{
				itsweight5 = ($('#act .performance').height() / actheight) * ($('#activity').height() / 300);
				if (!$('#act .performance').hasClass('zero')) 
				{
					its_integer = Math.round(itsweight5 * 100) + '%';
				} 
				else 
				{
					its_integer = 0 + '%';
				}
				return its_integer;
			})

			activity_performance = its_integer.substring(0, its_integer.length - 1);
			actheight = 0;

			$('#act .weighting-category').each(function() 
			{
				if (!$(this).hasClass('zero')) 
				{
					actheight += $(this).height();
				}

				if ($(this).height() == 0 || $(this).hasClass('zero')) 
				{
					$(this).addClass('zero');
					$(this).animate({
						height: (10),
					}, 500, function() {});
				}
			})
			
			actheight1 = $('#activity').height() - 8;
			
			$('#act .weighting-category').each(function() 
			{
				if ($(this).hasClass('zero')) 
				{
					actheight1 -= 10;
				}
			})
			
			if ($(this).height() >= actheight1) 
			{
				$(this).animate({
					height: (actheight1),
				}, 500, function() {});
			}
			
			maxheight = $('#activity').height() - 8;
			
			$('#act .weighting-category').each(function() 
			{
				if ($(this).hasClass('zero')) 
				{
					maxheight -= 10;
				}
			})

			$('#act .weighting-category').each(function() 
			{
				if (!$(this).hasClass('zero')) 
				{
					thispercentage = $(this).height() / actheight;
					$(this).animate({
						height: (maxheight * thispercentage),
					}, 500, function() {});
				}
			})
		}
	});
	
	// END RESIZABLES
});