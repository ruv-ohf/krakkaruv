
Drupal.contextual = Drupal.contextual || {};
Drupal.contextual.overlay = '<div class="contextual-border contextual-border-top"></div><div class="contextual-border contextual-border-right"></div><div class="contextual-border contextual-border-bottom"></div><div class="contextual-border contextual-border-left"></div>';

Drupal.behaviors.contextual = function(context) {
  var $links = $('.contextual-links');
  $("div.contextual-enabled").hover(function(event) {
    // Get the right actions from the closure region
    var classes = ($(this).attr("class"));
    var identifier = '#contextual-'+ classes.replace(/([^ ]+[ ]+)*contextual-([^ ]+)([ ]+[^ ]+)*/, '$2');
    $(this).prepend($(identifier));
    $(this).css({'position': 'relative'});

    // hide parent actions
    $('.contextual').css('padding-left', 100);
    $links.hide();
    $('.contextual').css('display', 'none');
    $('.contextual-border').remove();
    $('a.contextual-toggler').removeClass('contextual-toggler-active');

    // Show current actions
    $('.contextual:first', this).css('display', 'block').append(Drupal.contextual.overlay);
  },
  function() {
    $('.contextual', this).css('display', 'none');
    $('.contextual-border', this).remove();
  });
  $('a.contextual-toggler').add($links).hover(function(event) {
    $(this).parents('.contextual-enabled').addClass('contextual-region-active');
  },
  function() {
    $(this).parents('.contextual-enabled').removeClass('contextual-region-active');
  }); 
}

/**
 * toggles visibility on an element
 */
Drupal.contextual.toggleVis = function(element) {
  var element = $('#' + element);
  if (element.is(":hidden")) {
    element.slideDown('fast');
  } else {
    element.hide();
  }
  $('a.contextual-toggler', element.parent()).toggleClass('contextual-toggler-active');
}