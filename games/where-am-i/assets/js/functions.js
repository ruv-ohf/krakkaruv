/**
 * WhereAmI helper functions
 * 
 * @author compleXolution <info@complexolution.com>
 * @version 1.5.1
 */

/**
 * Translate text
 * 
 * @param {string} text
 * @returns {string}
 */
whereAmI.__ = function(text) {
    if (whereAmI.config.translations[text] 
        && 
        whereAmI.config.translations[text][whereAmI.lang]) 
    {
        text = whereAmI.config.translations[text][whereAmI.lang];
    }
    return text;
};

/**
 * Format a text containing variables
 * 
 * @param {string} text
 * @param {object} params
 * @returns {string}
 */
whereAmI.formatText = function(text, params) {
    for (var key in params) {
        text = text.replace('$'+key, params[key]);
    }
    return text;
};

/**
 * Toggle full screen (if possible)
 */
function toggleFullScreen() {
    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    }
} 

//-----------------------------------------------------------------------------

(function($){
    $(function(){
       
        $('body').on('click', '.change-style-menu-item', function() {
            $('link[title="bootstrap-theme"]').attr('href', "//maxcdn.bootstrapcdn.com/bootswatch/3.1.1/" + $(this).attr('rel') + "/bootstrap.min.css");
            return false;
        });
        
    });
})(jQuery);