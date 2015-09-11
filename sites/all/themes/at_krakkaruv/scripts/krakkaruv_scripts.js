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
    })
})(jQuery);
