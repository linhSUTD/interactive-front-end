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

app.config(['$httpProvider', function($httpProvider) {

	$httpProvider.defaults.headers.post = {
		'Content-Type': undefined
	}
}]);

app.controller('baseCtrl', ['$scope', '$cookies', 'settings', '$state', function ($scope, $cookies, settings, $state) {

	$scope.isLoggedIn = false;

	if ($cookies.get('token')) {
		$scope.isLoggedIn = true;
	}

	$scope.logout = function () {
		$cookies.put('token', undefined);
		$scope.isLoggedIn = false;
		$state.go('home');
	}

	$scope.changeLoginState = function (val) {
		$scope.isLoggedIn = val;
	}
}]);

