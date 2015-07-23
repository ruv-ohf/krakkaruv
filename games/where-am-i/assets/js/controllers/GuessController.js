/**
 * WhereAmI AngularJS module Guess controller
 * 
 * @author compleXolution <info@complexolution.com>
 * @version 1.5.1
 */
whereAmI.module.controller('GuessController', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', function($scope, $rootScope, $routeParams, $location, $timeout){
    
    // Has to be in a game
    if (!$rootScope.game) {
        $location.url('/');
        return;
    }
    
    // Don't allow going back
    if ($routeParams.turn < $rootScope.game.currentStep) {
        $location.url('/guess/' + $rootScope.game.currentStep);
        return;
    }
    
    /**
     * Make a guess
     */
    $scope.makeGuess = function(){
        $scope.location.errorDistance = google.maps.geometry.spherical.computeDistanceBetween($scope.location.coordinates, $scope.location.guess);
        $scope.location.roundedErrorDistance = Math.round($scope.location.errorDistance);
        $scope.location.roundedErrorDistanceKm = $scope.location.roundedErrorDistance / 1000;
        $scope.location.score = Math.round(Math.max(0, whereAmI.config.maxPointsPerGuess - $scope.location.roundedErrorDistanceKm * whereAmI.config.decreasePointsByKm));
        $rootScope.game.score += $scope.location.score;
        $rootScope.game.currentStep++;
        $location.url('/show/' + ($rootScope.game.currentStep-1));
    };
    
    // Initialize map
    var initializeMap = function(){
        var guessMarker,
            map = new google.maps.Map(document.getElementById('map'), {
            zoom: 1,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            streetViewControl: false
        });
		if (whereAmI.config.defaultMapPosition) {
			map.setCenter( new google.maps.LatLng(whereAmI.config.defaultMapPosition.lat,whereAmI.config.defaultMapPosition.lng) );
			map.setZoom(whereAmI.config.defaultMapPosition.zoom);
		} else {
			map.setCenter( new google.maps.LatLng(0,0) );
			map.setZoom(1);
        }
		
        google.maps.event.addListener(map, "click", function(e){
            if (!guessMarker) {
                guessMarker = new google.maps.Marker({
                    map: map,
                    visible: true,
                    title: "Your Guess",
                    animation: google.maps.Animation.DROP,
                    draggable: true
                });
                guessMarker.setIcon(whereAmI.config.markerIconGuess);
            }
            guessMarker.setPosition(e.latLng);
            $scope.$apply(function(){
                $scope.location.guess = e.latLng;
            });
        });
    };

    // Generate location
    if (!$rootScope.game.locations[$rootScope.game.currentStep]) {
        $scope.place = whereAmI.config.places[ Math.floor( Math.random() * whereAmI.config.places.length ) ];
        $scope.location = angular.copy($scope.place);
        $scope.location.guess = false;
        switch ($scope.place.type) {
            case 'streetViewLocation':
            case 'gallery':
                $scope.location.coordinates = new google.maps.LatLng($scope.location.coordinates[0], $scope.location.coordinates[1]);
                break;

            case 'streetViewRegion':
                $scope.location = angular.copy($scope.place);
                var latLngArray = [];
                jQuery.each($scope.location.coordinates, function(i, latLng) {
                    latLngArray.push(new google.maps.LatLng(latLng[0], latLng[1]));
                });
                var bounds = new google.maps.Polygon({
                        paths: latLngArray,
                        clickable: false,
                        draggable: false,
                        editable: false
                    }),
                    isWithinBoundary = false,
                    minLat = null,
                    minLng = null,
                    maxLat = null,
                    maxLng = null,
                    coords = null;
                for (var i in $scope.location.coordinates) {
                    var coord = $scope.location.coordinates[i];
                    if (minLat === null || coord[0] < minLat) {
                        minLat = coord[0];
                    }
                    if (maxLat === null || coord[0] > maxLat) {
                        maxLat = coord[0];
                    }
                    if (minLng === null || coord[1] < minLng) {
                        minLng = coord[1];
                    }
                    if (maxLng === null || coord[1] > maxLng) {
                        maxLng = coord[1];
                    }
                }
                if (minLng === maxLng) {
                    maxLng += 0.01;
                }
                if (minLat === maxLat) {
                    maxLat += 0.01;
                }
                while (!isWithinBoundary) {
                    coords = new google.maps.LatLng(Math.random() * (maxLat - minLat) + minLat, Math.random() * (maxLng - minLng) + minLng, true);
                    isWithinBoundary = google.maps.geometry.poly.containsLocation(coords, bounds);
                }
                $scope.location.coordinates = coords;
                break;
        }
        $rootScope.game.locations[$rootScope.game.currentStep] = $scope.location;
    } else {
        $scope.location = $rootScope.game.locations[$rootScope.game.currentStep];
    }


    // Generate panorama
    switch ($scope.location.type) {
        case 'streetViewLocation':
        case 'streetViewRegion':
            // Initialize street view service
            var streetViewService = new google.maps.StreetViewService();
			var searchRadius = $scope.location.type === 'streetViewLocation' ? 0.00000001 : whereAmI.config.searchRadius;
            var getPanorama = function(){
                streetViewService.getPanoramaByLocation($scope.location.coordinates, searchRadius, function(data, status) {
                    if (status !== google.maps.StreetViewStatus.OK) {
                        searchRadius *= 10;
                        return getPanorama();
                    } else {
                        $scope.$apply(function(){
                            $scope.location.coordinates = data.location.latLng;
                            if ($scope.location.type === 'streetViewRegion') {
                                $scope.location.name = data.location.description;
                            }

                            initializeMap();
                            
                            // Initialize street view
                            var streetView = new google.maps.StreetViewPanorama(document.getElementById('streetView'), {
                                position: $scope.location.coordinates,
                                visible: true,
                                addressControl: false,
                                enableCloseButton: false,
                                zoomControl: false,
                                panControl: false,
                                navigationControl: false,
                                imageDateControl: false,
                                linksControl: false,
                                pov: {
                                    heading: Math.floor(Math.random() * 360),
                                    pitch: 0,
                                    zoom: 1
                                }
                            });
                        });
                    }
                });
            };
            getPanorama();
            break;
            
        default: 
            $timeout(function(){
                initializeMap();
            }, 500);
    }
    
    
    setTimeout(function(){
        var hideMapOnResize = function(){ 
            var $previewPanel = jQuery('.preview-panel'),
                $mapContainer = jQuery('#mapContainer');
            if (jQuery('body').width() < 786 && !$mapContainer.hasClass('hidden') && !$previewPanel.hasClass('hidden')) { 
                $mapContainer.addClass('hidden');
            } 
        };
        hideMapOnResize();
    }, 2000);

}]);
