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
	}
}]);

app.controller('baseCtrl', ['$scope', 'settings', '$state', 'authService', function (
	$scope, settings, $state, authService) {

	$scope.currentUser = null;

	authService.tryPreviousSession(function (result) {
		$scope.isLoggedIn = result;
		if (result) {
			$scope.currentUser = authService.getCurrentUser();
		}
	});

	$scope.logout = function () {
		authService.logout();
		$scope.isLoggedIn = false;
		$state.go('home');
	}

	$scope.changeLoginState = function (val) {
		$scope.isLoggedIn = val;
	}
}]);
