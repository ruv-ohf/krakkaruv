/**
 * WhereAmI AngularJS module Show controller
 * 
 * @author compleXolution <info@complexolution.com>
 * @version 1.5.1
 */
whereAmI.module.controller('ShowController', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', function($scope, $rootScope, $routeParams, $location, $timeout){
    
    // Has to be in a game
    if (!$rootScope.game) {
        $location.url('/');
        return;
    }
    
    // Don't allow going forward
    if ($routeParams.turn != $rootScope.game.currentStep-1) {
        $location.url('/guess/' + $rootScope.game.currentStep);
        return;
    }
    
    $scope.location = $rootScope.game.locations[$rootScope.game.currentStep-1];
    $scope.dealsUrl = $scope.location.deals ? $scope.location.deals.replace('%%COORDINATES%%', $scope.location.coordinates.lat() + ',' +  $scope.location.coordinates.lng()) : 'about:blank';
    
    /**
     * Show next guess, or summary if finished
     */
    $scope.next = function(){
        if ($rootScope.game.currentStep > $rootScope.game.steps) {
            $location.url('/game-over');
        } else {
            $location.url('/guess/' + $rootScope.game.currentStep);
        }
    };
    
    // Show results
    bootbox.alert(whereAmI.formatText(whereAmI.__('GUESS_SUMMARY'), {
                    points: $scope.location.score, 
                    location: $scope.location.name,
                    distance: $scope.location.roundedErrorDistanceKm}));
        
    
    // Initialize map
    var initializeMap = function(){
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 1,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            streetViewControl: false
        });
        map.setCenter( new google.maps.LatLng(0,0) );
        map.setZoom(1);
        
        var guessMarker = new google.maps.Marker({
            map: map,
            visible: true,
            title: "Your Guess",
            animation: google.maps.Animation.DROP,
            draggable: true
        });
        guessMarker.setIcon(whereAmI.config.markerIconGuess);
        guessMarker.setPosition($scope.location.guess);
        
        var correctMarker = new google.maps.Marker({
            map: map,
            visible: true,
            title: "Correct Answer",
            animation: google.maps.Animation.DROP,
            draggable: true
        });
        correctMarker.setIcon(whereAmI.config.markerIconCorrect);
        correctMarker.setPosition($scope.location.coordinates);
        google.maps.event.addListener(correctMarker, 'click', function() {
            bootbox.alert($scope.location.name);
        });
        
        var bounds = new google.maps.LatLngBounds();
        bounds.extend($scope.location.coordinates);
        bounds.extend($scope.location.guess);
        map.fitBounds(bounds);
    };
    
    
    setTimeout(initializeMap, 1000);
    
    
    setTimeout(function(){
        var hideMapOnResize = function(){ 
            var $previewPanel = jQuery('.preview-panel'),
                $mapContainer = jQuery('#mapContainer');
            if (jQuery('body').width() < 786 && !$mapContainer.hasClass('hidden') && !$previewPanel.hasClass('hidden')) { 
                $mapContainer.addClass('hidden');
            } 
        };
        hideMapOnResize();
    }, 5000);

}]);
