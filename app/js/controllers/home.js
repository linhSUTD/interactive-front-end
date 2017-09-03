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

homeModule.controller('homeCtrl', ['$scope', '$course', 'userService', '$state', function ($scope, $course, userService, $state) {
	function checkAuth() {
		var user = userService.getUser();

		if (!!user) {
			$state.go('dashboard');
			return true;
		}

		return false;
	}

	if (checkAuth()) {
		return;
	}

	$scope.$on("auth:ready", checkAuth);

	$course.recentCourses(null, null, 10, "descending").then(function (response) {
		if (response.status >= 400) {
			return;
		}

		$scope.recentCourses = response.data;
	});
}]);
