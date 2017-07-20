/**
 * Created by nguyenlinh on 7/15/17.
 */
var loginModule = angular.module('page.login', ['ngCookies']);

loginModule.config(function($stateProvider, $urlRouterProvider) {

	$stateProvider
		.state('login', {
			url: '/login',
			controller: 'loginCtrl',
			templateUrl: '../partials/login.html'
		})
})

loginModule.controller('loginCtrl', ['$scope', '$http', 'authService', 'settings', '$cookies', '$state',
			function($scope, $http, authService, settings, $cookies, $state) {

	$scope.user = {};

	$scope.login = function() {

		authService.login($scope.user).then(function (response) {

			$cookies.put('token', response.data);

			$state.go('dashboard');

		}, function (error) {

			showPopUp(error.data.error);

		})
	}
}]);

