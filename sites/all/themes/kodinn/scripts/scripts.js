(function($) {
    Drupal.behaviors.custom = {
    attach: function (context) {

        ///* Burger Menu Animation *///
        $('.nav-icon').click(function(){
            $(this).toggleClass('open');
            $('.main-menu .content').toggleClass('active')
        });


        }
    };
})(jQuery);

