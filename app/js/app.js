'use strict';

var app = angular.module('mainApp', [
	'config',
	'ui.router',
	'page.home',
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

app.config(['$httpProvider', function ($httpProvider) {
	$httpProvider.defaults.headers.post = {
		'Content-Type': undefined
	};

	$httpProvider.defaults.headers.put = {
		'Content-Type': undefined
	};
}]);

app.controller('baseCtrl', ['$scope', '$rootScope', 'settings', '$state', 'authService', function (
	$scope, $rootScope, settings, $state, authService) {

	$scope.currentUser = null;
	$scope.authReady = false;

	authService.tryPreviousSession(function (result) {
		$scope.isLoggedIn = result;
		if (result) {
			$scope.currentUser = authService.getCurrentUser();
		}
		$scope.authReady = true;
	});

	$scope.logout = function () {
		authService.logout();
		$scope.isLoggedIn = false;
		$state.go('home');
	}

	$scope.$on("user:loggedin", function () {
		$scope.isLoggedIn = true;
		$scope.currentUser = authService.getCurrentUser();
	});
}]);
