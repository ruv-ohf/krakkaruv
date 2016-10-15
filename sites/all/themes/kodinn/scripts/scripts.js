(function($) {
    Drupal.behaviors.custom = {
    attach: function (context) {

        ///* Burger Menu Animation *///
        $('.nav-icon').click(function(){
            $(this).toggleClass('open');
            $('.main-menu .content').toggleClass('active')
        });

        /* -------------------------------------------
 			Main Header hide and reveal on scroll
 		------------------------------------------- */

		var didScroll;
    	var lastScrollTop = 0;
    	var delta = 5;
    	var navbarHeight = $('.main-menu').outerHeight();

    	$(window).scroll(function(event){
        	didScroll = true;
    	});

    	setInterval(function() {
        if (didScroll) {
            hasScrolled();
            didScroll = false;
        }
    	}, 250);

    	function hasScrolled() {
        	var st = $(this).scrollTop();
        
        	if(Math.abs(lastScrollTop - st) <= delta)
            return;

        	if (st > lastScrollTop && st > navbarHeight){
            	$('.main-menu').removeClass('main-menu-down').addClass('main-menu-up');
        	} 

        	else {
            	if(st + $(window).height() < $(document).height()) {
                	$('.main-menu').removeClass('main-menu-up').addClass('main-menu-down');
            	}
        	}

        	lastScrollTop = st;
    	}




        }
    };
})(jQuery);

