/**
 * Created by drupalviking on 01/09/15.
 */
(function($) {
    $(document).ready(function() {
        $(".text-boxes").toggle();
        $(".toggle-text-boxes").click(function() {
            $(".text-boxes").toggle("slow");
        });
    })
})(jQuery);
