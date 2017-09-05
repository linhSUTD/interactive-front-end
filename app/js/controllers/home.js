var homeModule = angular.module('page.home', ['service.academic']);

homeModule.config(function ($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise('/home');

	$stateProvider
		.state('home', {
			url: '/home',
			controller: 'homeCtrl',
			templateUrl: '../partials/home.html'
		});
})

function homeCtrlFunc($scope, $course, userService, $state) {
	var user = userService.getUser();

	if (!!user) {
		$state.go('dashboard');
		return;
	}

	$course.recentCourses(null, null, 10, "descending").then(function (response) {
		if (response.status >= 400) {
			return;
		}

		$scope.recentCourses = response.data;
	});
}

homeModule.controller('homeCtrl', [
	'$scope',
	'$course',
	'userService',
	'$state', function ($scope, $course, userService, $state) {
		if ($scope.authReady) {
			homeCtrlFunc($scope, $course, userService, $state);
			return;
		}

		$scope.$on("auth:ready", _ => homeCtrlFunc($scope, $course, userService, $state));
	}]);
