(function($) {
    Drupal.behaviors.gsapAnimation = {
    attach: function (context) {

            var hex = $('#Polygon_4_copy_2');
            var hex2 = $('#Polygon_4');
            var hex3 = $('#Polygon_4_copy_10');
            var hex4 = $('#Polygon_4_copy_11');
            var hex5 = $('#Polygon_4_copy_19');
            var hex6 = $('#Polygon_4_copy_14');
            var hex7 = $('#Polygon_4_copy_8');
            var hex8 = $('#Polygon_4_copy_10');
            
            
            TweenMax.staggerFrom(hex, 0.35, {
                css: {opacity:0},
                yoyo: true,
                delay:0.5,
                repeat: -1,
                repeatDelay: 4
            });

            TweenMax.staggerFrom(hex2, 0.25, {
                css: {opacity:0},
                yoyo: true,
                delay:0.7,
                repeat: -1,
                repeatDelay: 5
            });

            TweenMax.staggerFrom(hex3, 0.45, {
                css: {opacity:0},
                yoyo: true,
                delay:0.8,
                repeat: -1,
                repeatDelay: 6
            });

            TweenMax.staggerFrom(hex4, 0.15, {
                css: {opacity:0},
                yoyo: true,
                delay:0.9,
                repeat: -1,
                repeatDelay: 7
            });

            TweenMax.staggerFrom(hex5, 0.27, {
                css: {opacity:0},
                yoyo: true,
                delay:1,
                repeat: -1,
                repeatDelay: 8
            });

            TweenMax.staggerFrom(hex6, 0.37, {
                css: {opacity:0},
                yoyo: true,
                delay:0.66,
                repeat: -1,
                repeatDelay: 8
            });

            TweenMax.staggerFrom(hex7, 0.47, {
                css: {opacity:0},
                yoyo: true,
                delay:0.82,
                repeat: -1,
                repeatDelay: 10
            });

            TweenMax.staggerFrom(hex8, 0.4, {
                css: {opacity:0},
                yoyo: true,
                delay:0.92,
                repeat: -1,
                repeatDelay: 11
            });

        }
    };
})(jQuery);

