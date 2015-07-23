/**
 * WhereAmI AngularJS module
 * 
 * @author compleXolution <info@complexolution.com>
 * @version 1.5.1
 */
whereAmI.module = angular.module('WhereAmI', ['ngRoute', 'ngSanitize'])

    /**
     * Configuration
     * 
     * @param object $routeProvider
     */
    .config([ '$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        
        $locationProvider.html5Mode(false);
        $routeProvider
            .when('/', { templateUrl: 'assets/templates/pages/welcome.html', controller: 'WelcomeController'})
            .when('/guess/:turn', { templateUrl: 'assets/templates/pages/guess.html', controller: 'GuessController'})
            .when('/show/:turn', { templateUrl: 'assets/templates/pages/show.html', controller: 'ShowController'})
            .when('/game-over', { templateUrl: 'assets/templates/pages/game-over.html', controller: 'GameOverController'});
        
        $routeProvider.otherwise({ redirectTo : '/' });
        
    }])

    /**
     * Run the application
     * 
     * @param $rootScope    AngularJS root scope
     * @param $filter       AngularJS filter service
     */
    .run(['$rootScope', '$location', function($rootScope, $location){

        // Pass config to scope
        $rootScope.config = whereAmI.config;
        
        // User object
        $rootScope.user = {};

        // Set up translation
        whereAmI.lang = $rootScope.lang = (navigator.language || navigator.userLanguage).substr(0,2);
        if (!$rootScope.lang || jQuery.inArray($rootScope.lang, whereAmI.config.availableLanguages) === -1) {
            whereAmI.lang = $rootScope.lang = whereAmI.config.defaultLanguage;
        }
        
        // Current game
        $rootScope.game = null;
        
        /**
         * Toggle map in mobile view
         */
        $rootScope.toggleMap = function() {
            var $previewPanel = jQuery('.preview-panel'),
                $mapContainer = jQuery('#mapContainer');
            if (!$mapContainer.hasClass('hidden') && !$previewPanel.hasClass('hidden')) {
                $previewPanel.addClass('hidden');
            } else {
                $previewPanel.toggleClass('hidden');
                $mapContainer.toggleClass('hidden');
            }
        };
        
        /**
         * Start new game
         */
        $rootScope.newGame = function(){
            var startNewGame = function(){
                $rootScope.game = angular.copy(whereAmI.config.newGameTemplate);
                $rootScope.game.currentStep = 1;
                $rootScope.game.locations = [];
                $location.url('/guess/1');
            };
            if ($rootScope.game && $rootScope.game.currentStep <= $rootScope.game.steps) {
                bootbox.confirm(whereAmI.__('CONFIRM_NEW_GAME'), function(confirmed){
                    if (confirmed) {
                        $rootScope.$apply(function(){
                            startNewGame();
                        });
                    }
                });
            } else {
                startNewGame();
            }
        };
        
        /**
         * Leaderboard
         */
        $rootScope.leaderboard = function(data){
            $.post(whereAmI.config.leaderboard, {'data': data}, function(leaderboardHtml){
                bootbox.dialog({
                    message: leaderboardHtml,
                    buttons: {
                        ok: {
                            label: whereAmI.__("Close"),
                            className: "btn-success",
                            callback: function() {
                            }
                        }
                    }
                });
            });
        };
        
    }])

    /**
     * Translation filter
     * 
     * @returns {whereAmI.__}
     */
    .filter('translate', [function(){
        return whereAmI.__;
    }])

    /**
     * Format text filter
     * 
     * @returns {whereAmI.__}
     */
    .filter('formatText', [function(){
        return whereAmI.formatText;
    }]);
    