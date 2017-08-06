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
	'page.courses',
	'page.firstCourse',
	'service.auth',
	'ngCookies'
]);

app.run(function ($cookies, $state, settings) {

	if ($cookies.get('token')) {
		window.location = settings.webUrl + settings.pageUrl.DASH_BOARD;
	}
})

app.controller('baseCtrl', ['$scope', '$cookies', 'settings', function ($scope, $cookies, settings) {

	$scope.isLoggedIn = false;

	if ($cookies.get('token')) {
		$scope.isLoggedIn = true;
	}

	$scope.logout = function () {
		$cookies.put('token', undefined);
		$scope.isLoggedIn = false;
		window.location = settings.webUrl + settings.pageUrl.HOME;
	}

	$scope.changeLoginState = function (val) {
		$scope.isLoggedIn = val;
	}
}]);

