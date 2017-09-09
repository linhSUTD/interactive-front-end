'use strict';

var app = angular.module('mainApp', [
	'config',
	'ui.router',
	'page.home',
	'page.courses',
	'page.login',
	'page.registration',
	'page.forgotPassword',
	'page.resetPassword',
	'page.dashboard',
	'page.contactUs',
	'page.course',
	'page.lesson',
	'page.user',
	'service.user',
	'service.auth',
	'ngCookies'
]);

app.config(['$httpProvider', '$stateProvider', '$locationProvider', function ($httpProvider, $stateProvider, $locationProvider) {
	$httpProvider.defaults.headers.post = {
		'Content-Type': undefined
	};

	$httpProvider.defaults.headers.put = {
		'Content-Type': undefined
	};

	$stateProvider
		.state('default', {
			url: '/auth',
			template: '<div></div>'
		});

	$locationProvider.html5Mode({
		enabled: false,
		requireBase: false
	});
}]);

app.controller('baseCtrl', ['$scope', '$rootScope', 'settings', '$state', 'authService', function (
	$scope, $rootScope, settings, $state, authService) {

	$scope.currentUser = null;
	$scope.authReady = false;

	console.log($state.current.name);

	authService.tryPreviousSession(function (result) {
		$scope.isLoggedIn = result;
		if (result) {
			$scope.currentUser = authService.getCurrentUser();
		}
		$scope.authReady = true;

		$rootScope.$broadcast("auth:ready");
	});

	$scope.logout = function () {
		authService.logout();
		$scope.isLoggedIn = false;
		$state.go('home');
	};

	$scope.$on("user:loggedin", function () {
		$scope.isLoggedIn = true;
		$scope.currentUser = authService.getCurrentUser();
	});
}]);
