var dashboardModule = angular.module('page.dashboard', ['ngCookies', 'service.academic']);

dashboardModule.config(function ($stateProvider, $urlRouterProvider) {

	$stateProvider
		.state('dashboard', {
			url: '/dashboard',
			controller: 'dashboardCtrl',
			templateUrl: '../../partials/dashboard.html'
		})
});

function dashboardCtrlFunc($scope, $state, $course, userService) {
	var user = userService.getUser();
	if (!user) {
		$state.go('home');
		return;
	}

	$course.recentCourses(null, null, 10, "descending").then(function (response) {
		if (response.status >= 400) {
			return;
		}

		$scope.recentCourses = response.data;

		setTimeout(function () {
			$('.owl-carousel').trigger('refresh.owl.carousel');
		}, 1000);
	});
}

dashboardModule.controller('dashboardCtrl', ['$scope', '$state', '$course', 'userService', function ($scope, $state, $course, userService) {
	if ($scope.authReady) {
		dashboardCtrlFunc($scope, $state, $course, userService);
		return;
	}

	$scope.$on("auth:ready",
		_ => dashboardCtrlFunc($scope, $state, $course, userService));
}]);
