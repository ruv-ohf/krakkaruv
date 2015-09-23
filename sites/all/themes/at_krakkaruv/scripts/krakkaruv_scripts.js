/**
 * Created by drupalviking on 01/09/15.
 */
(function($) {
    $(document).ready(function() {
        $(".text-box").toggle();
        $(".side-boxes").toggle();
        $(".toggle-text-boxes").click(function() {
            $(".text-box").toggle("slow");
            $(".side-boxes").toggle("slow");
        });
        do_resize_fix();
    });

    $(window).resize(function(){
    	do_resize_fix();
    });

    var do_resize_fix = function(){
    	var vidwith = 1920; //100%
        var vidheight = 1080; //??
        var pxadd = 10;

        var vidratio = (vidheight / vidwith);

        console.log(vidratio);

        var menuheight = Math.round($(window).width() * vidratio);

        $('#menu-bar').height(menuheight);
    }

})(jQuery);
