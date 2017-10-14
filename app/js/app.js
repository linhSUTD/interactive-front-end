'use strict';

var app = angular.module('mainApp', [
	'config',
	'ui.router',
	'page.home',
	'page.courses',
	'page.login',
	'page.registration',
	'page.forgotPassword',
	'page.dashboard',
	'page.contactUs',
	'page.course',
	'page.lesson',
	'page.user',
	'service.user',
	'service.auth',
	'ngCookies',
	'service.academic',
	'ngDisqus'
]);

app.config(['$httpProvider', '$stateProvider', '$locationProvider', '$urlRouterProvider', 'settings', '$disqusProvider',
	function ($httpProvider, $stateProvider, $locationProvider, $urlRouterProvider, settings, $disqusProvider) {
		$urlRouterProvider.otherwise('/');

		$httpProvider.defaults.headers.post = {
			'Content-Type': undefined
		};

		$httpProvider.defaults.headers.put = {
			'Content-Type': undefined
		};

		$locationProvider.html5Mode({
			enabled: settings.html5mode,
			requireBase: false
		});

		$locationProvider.hashPrefix('!');

        $disqusProvider.setShortname('fundaml');
	}
]);

app.controller('baseCtrl', ['$scope', '$rootScope', 'settings', '$state', 'authService', '$course', function (
	$scope, $rootScope, settings, $state, authService, $course) {

	$scope.adminPageUrl = settings.pageUrl.ADMIN;
	$scope.currentUser = null;
	$scope.authReady = false;

	if (!supportsES6()) {
		alert("Trình duyệt của bạn đã lỗi thời và nhiều tính năng có thể không hoạt động.\n Hãy nâng cấp trình duyệt của mình nếu có thể");
	}

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

	$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
		const affectedModule = "lesson";
		window.scrollTo(0, 0);

		if (toState.name.toLowerCase().indexOf(affectedModule) < 0) {
			return;
		}

		if (!supportsES6()) {
			alert("Trình duyệt của bạn không hỗ trợ tính năng code trực tiếp. Vui lòng nâng cấp");
		}
	});

	$course.recentCourses(null, null, 50, "descending").then(function (response) {
		if (response.status >= 400) {
			return;
		}

		$scope.courses = response.data;
	});
}]);
