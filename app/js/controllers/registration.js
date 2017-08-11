/**
 * Created by nguyenlinh on 7/15/17.
 */
var registrationModule = angular.module('page.registration', ['ngCookies']);

registrationModule.config(function($stateProvider, $urlRouterProvider){

	$stateProvider
		.state('registration', {
			url: '/registration',
			controller: 'registrationCtrl',
			templateUrl: '../partials/registration.html'
		})
});

registrationModule.controller('registrationCtrl', ['$scope', '$http', 'authService', 'settings', '$cookies',
	function ($scope, $http, authService, settings, $cookies) {

	$scope.user = {};

	authService.getCourses().then(function(data) {
		console.log(data);
	})

	$scope.register = function() {

		authService.register($scope.user).then(function(response) {

			showPopUp("Create account successfully.");

			setTimeout(function() {
				$cookies.put('token', response.data.token);
				window.location = settings.pageUrl.DASH_BOARD;
			}, 2000);

		}, function(error) {
			showPopUp(error.data.error);
		})
	}
}]);