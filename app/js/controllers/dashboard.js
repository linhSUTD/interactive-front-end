var dashboardModule = angular.module('page.dashboard', ['ngCookies', 'service.academic']);

dashboardModule.config(function ($stateProvider, $urlRouterProvider) {

	$stateProvider
		.state('dashboard', {
			url: '/dashboard',
			controller: 'dashboardCtrl',
			templateUrl: '../../partials/dashboard.html'
		})
});

dashboardModule.controller('dashboardCtrl', ['$scope', '$state', '$course', 'userService', function ($scope, $state, $course, userService) {
	function checkAuth() {
		var user = userService.getUser();

		if (!user) {
			$state.go('home');
			return false;
		}

		return true;
	}

	$scope.$on("auth:ready", checkAuth);

	if (!checkAuth()) {
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
}]);