/**
 * WhereAmI AngularJS module Game over controller
 * 
 * @author compleXolution <info@complexolution.com>
 * @version 1.5.1
 */
whereAmI.module.controller('GameOverController', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', function($scope, $rootScope, $routeParams, $location, $timeout){
    
    // Has to be in a game
    if (!$rootScope.game) {
        $location.url('/');
        return;
    }
    
    // Allow only if all steps were guessed
    if ($rootScope.game.steps >= $rootScope.game.currentStep) {
        $location.url('/guess/' + $rootScope.game.currentStep);
        return;
    }
    
    $scope.showSubmitForm = true;
    $scope.submitLeaderboard = function(){
        $scope.showSubmitForm = false;
        $rootScope.leaderboard({
            score: $rootScope.game.score,
            username: $rootScope.user.username
        });
    };
    
    $scope.shareOnFacebook = function(){
        var url = 'https://www.facebook.com/dialog/stream.publish?app_id=' + whereAmI.config.facebookAppId +
                    '&display=popup' +
					'&message=' + escape('I scored '+$rootScope.game.score+' in '+whereAmI.config.branding+'. Can you beat my score?') +
                    '&action_links=' + escape('{"text":"' + whereAmI.config.branding + '","href":"' + location.href.replace(/#.*/,'') + '"}') +
					'&attachment=' + escape('{"name":"' + whereAmI.config.branding + '","caption":"I scored '+$rootScope.game.score+' in '+whereAmI.config.branding+'. Can you beat my score?","href":"' + location.href.replace(/#.*/,'') + '"}') +
                    '&redirect_uri=' + escape(location.href);
        location.href = url;
    };
    
}]);
