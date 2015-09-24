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
        $('.front #block-system-main-menu ul li').hide();
        $('.front #block-block-1').hide();
        
        $('.front #block-block-1').fadeTo('slow',1,function(){
	        $('#block-system-main-menu ul li').each(function(i,x){
	        	var dtime = (i * 100) + 100;
	        	$(x).delay(dtime).fadeTo('slow',1);
	        });
        });


    });

    $(window).resize(function(){
    	do_resize_fix();
    });

    var do_resize_fix = function(){
    	var vidwith = 1920; //100%
        var vidheight = 1080; //??
        var pxadd = 10;

        var vidratio = (vidheight / vidwith);

        var menuheight = Math.round($(window).width() * vidratio);

        $('.front #menu-bar').height(menuheight);

        //JS fix for first item in hladbord

        var first_item_img_width = 690;
        var first_item_img_height = 390;

        var first_item_img_ratio = (first_item_img_height / first_item_img_width);

        var hladbord_first_item_width = $('.pane-hladbord-nodes-panel-pane-1 .views-row-1').width();

        var first_item_img_correct_height = Math.round( hladbord_first_item_width * first_item_img_ratio) - 1;

        $('.pane-hladbord-nodes-panel-pane-1 .views-row-1').height(first_item_img_correct_height);

    }

})(jQuery);
