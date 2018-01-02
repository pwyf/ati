jQuery(document).ready(function($){

  $('a.faq-cat-link').click(function(e) {
    e.preventDefault();
    $(this).toggleClass('open');
    target = $(this).parent().next();
    if(!target.hasClass('open')) {
      target.slideDown('slow');
      target.addClass('open');
    } else {
      target.removeClass('open');
      target.slideUp('slow');
    }
  });

  $('.summary-link a').click(function(e) {
    e.preventDefault();
    $(this).toggleClass('open');
    target = $(this).parent().next();
    if(!target.hasClass('open')) {
      target.slideDown('slow');
      target.addClass('open');
    } else {
      target.removeClass('open');
      target.slideUp('slow');
    }
  });

  $('.download-link a').click(function(e) {
    e.preventDefault();
    $(this).toggleClass('open');
    target = $(this).parent().next();
    if(!target.hasClass('open')) {
      target.slideDown('fast');
      target.addClass('open');
    } else {
      target.removeClass('open');
      target.slideUp('fast');
    }
  });

  $('.methodology-close').click(function(e) {
    var target = $(this).parent().parent();
    var $link = $(this).parent().parent().prev().children();
    $link.toggleClass('open');
    target.toggleClass('open');
    target.slideUp('slow');
  });

  $('.glossary-link').click(function(e) {
    $('.glossary-link').removeClass('open');
    $(this).addClass('open');
    $('.glossary-entry-group').removeClass('open');
    var targetID = e.target.id;
    var targetGroup = $('.glossary-entry-group.'+targetID)
    targetGroup.toggleClass('open');
  });

  $('.conclusions-block').on('click', function(e) {
    $(this).toggleClass('open');
  });

  $('.donormorelink').click(function(e) {
    e.preventDefault();
    $(this).animate({
             height: (0),
           }, 500, function() {
              $(this).hide();
        });
    $(this).next().slideDown();
  });
  $('.closedonormore a').click(function(e) {
    e.preventDefault();
    $(this).parent().parent().slideUp();
    $(this).parent().parent().prev().children().fadeIn();
    $('.donormorelink').animate({
             height: (14),
           }, 500, function() {
              $(this).show();
        });
  });
  $('#menu-main-nav li.dropdown > a').click(function(e) {
      e.preventDefault();
      var clickedSub = $(this).parent().find('.sub-menu');
      $(this).parent().parent().children().find('.sub-menu.open').not(clickedSub).slideUp();
      $(this).parent().parent().children().find('.sub-menu.open').not(clickedSub).removeClass('open');
      if(!$(this).parent().hasClass('current-menu-ancestor')) {
        $(this).parent().find('.sub-menu').first().slideToggle();
        $(this).parent().find('.sub-menu').first().toggleClass('open');
      }
  });
  $('.donorscoringheader').click(function(e) {
    var targetID = $(this).attr('id');
    $('.donorscoringheader.open').not($(this)).removeClass('open');
    $(this).toggleClass('open');
    $('.donor-indicator-group:not(.'+targetID+')').slideUp();
    $('.donor-indicator-group.'+targetID).slideToggle();
    $('.donor-indicator-group.'+targetID).find($('.indicatorlist h4.open')).removeClass('open');
    $('.donor-indicator-group.'+targetID).find($('.indicatordetails')).hide();
    $('.donor-indicator-group.'+targetID).find($('.indicatordetails')).removeClass('open');
  });
  $('.donor-indicator-group .subcat h4').click(function(e) {
    targetsubcatID = e.target.id;
    $(this).parent().find($('h4')).removeClass('open');
    $(this).addClass('open');

    targetSub = $(this).parent().parent().find($('.indicatorlist .'+targetsubcatID));
    $(this).parent().parent().find($('.indicatorlist > div')).not(targetSub).hide();
    $(this).parent().parent().find($('.indicatorlist > div')).not(targetSub).removeClass('open');
    if(!targetSub.hasClass('open')){
      targetSub.toggleClass('open');
      targetSub.show();
      targetSub.find('h4').removeClass('open');
      //targetSub.find('h4:first').addClass('open');
      targetFirstIndID = targetSub.find('h4:first').attr('id');

      //targetSub.parent().next().find($('.indicatordetails')).hide();
      //targetSub.parent().next().find($('.indicatordetails.'+targetFirstIndID)).show();
    }
  });

  $('.donor-indicator-group .indicatorlist h4').click(function(e) {
    targetIndID = e.target.id;
    $(this).parent().find('h4').removeClass('open');
    $(this).addClass('open');

    targetInd = $('.'+targetIndID);
    $(this).parent().parent().next().find($('.indicatordetails')).not(targetInd).hide();
    $(this).parent().parent().next().find($('.indicatordetails')).not(targetInd).removeClass('open');
    if(!targetInd.hasClass('open')){
      targetInd.toggleClass('open');
      targetInd.show();
    }
  });

  // Donor Single Indicator History Popup SimpleModal
  // Load dialog on click
  $('.indicatorHistoryLink').click(function (e) {
    $(this).parent().parent().find($(".historymodal")).modal({
      overlayClose: true,
      closeHTML: '<span>Close</span>',
      minHeight: 712,
      maxHeight: 2000,
      maxWidth: 1000,
      opacity:75,
      containerCss: {
        'position' : 'absolute'
      },
    });

    return false;
  });
  //Indicator history modal lengthy text expand links
  $('.expandlink').click(function(e){
    e.preventDefault();
    $(this).next().slideDown();
    $(this).hide();
    $(this).prev().hide();

  });

  //Twitter share button
  $('.popup').click(function(event) {
  var width  = 575,
    height = 400,
    left   = ($(window).width()  - width)  / 2,
    top    = ($(window).height() - height) / 2,
    url    = this.href,
    opts   = 'status=1' +
         ',width='  + width  +
         ',height=' + height +
         ',top='    + top    +
         ',left='   + left;

  window.open(url, 'share', opts);

  return false;
  });

  $('input:text, textarea').each(function(){
    var $this = $(this);
    $this.data('placeholder', $this.attr('placeholder'))
       .focus(function(){$this.removeAttr('placeholder');})
       .blur(function(){$this.attr('placeholder', $this.data('placeholder'));});
  });

    $("#page").css({'height':($("#main").height()+'px')});

});
