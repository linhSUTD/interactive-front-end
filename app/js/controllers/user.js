/**
 * Created by nguyenlinh on 8/10/17.
 */
var userModule = angular.module('page.user', ['duScroll']);

userModule.config(function($stateProvider, $urlRouterProvider){

	$stateProvider
		.state('user', {
			url: '/user/:userId',
			templateUrl: '../../partials/user/user.html'
		})
		.state('user.profile', {
			url: '/profile',
			controller: 'userProfileCtrl',
			templateUrl: '../../partials/user/userProfile.html'
		})
		.state('user.settings', {
			url: '/settings',
			controller: 'userSettingsCtrl',
			templateUrl: '../../partials/user/userSettings.html'
		})
})

userModule.controller('userProfileCtrl', ['$scope', '$stateParams', function($scope, $stateParams) {

}]);

userModule.controller('userSettingsCtrl', ['$scope', '$stateParams', function($scope, $stateParams) {

}]);