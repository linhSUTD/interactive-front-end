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

registrationModule.controller('registrationCtrl', ['$scope', '$http', 'authService', 'settings', '$cookies', '$state',
	function ($scope, $http, authService, settings, $cookies, $state) {

	$scope.user = {};

	$scope.register = function() {

		authService.register($scope.user).then(function(response) {

			$cookies.put('token', response.data);

			$state.go('dashboard');

		}, function(error) {

			showPopUp("Error! " + error.data.message);
		})
	}
}]);