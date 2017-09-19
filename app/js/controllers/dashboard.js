var dashboardModule = angular.module('page.dashboard', ['ngCookies', 'service.academic', 'ui.bootstrap']);

dashboardModule.config(function ($stateProvider, $urlRouterProvider) {

	$stateProvider
		.state('dashboard', {
			url: '/dashboard',
			controller: 'dashboardCtrl',
			templateUrl: '../../partials/dashboard.html'
		})
});

/**
 * Dashboard Page
 * @param $scope
 * @param $state
 * @param $course
 * @param userService
 */
function dashboardCtrlFunc($scope, $state, $course, userService) {

	var user = userService.getUser();
	if (!user) {
		$state.go('home');
		return;
	}

	$scope.state = 'unregistered';

	// Get achievements
	userService.achievements(user.id).then(res => {
		$scope.achievements = res.data;
	});

	$scope.finishedCourses = [];
	$scope.ongoingCourses = [];

	/**
	 * Query course subscriptions
	 */
	$course.subscriptions(user.id, null, null, 100, "descending").then(function (response) {
		$scope.ongoingCourses = response.data.filter(c => !c.completed);
		$scope.finishedCourses = response.data.filter(c => c.completed);

		if ($scope.ongoingCourses != null && $scope.ongoingCourses.length > 0) {
			$scope.state = 'registered';
		}
	});
}

dashboardModule.controller('dashboardCtrl', ['$scope', '$state', '$course', 'userService', function ($scope, $state, $course, userService) {

	if ($scope.authReady) {
		dashboardCtrlFunc($scope, $state, $course, userService);
		return;
	}

	$scope.$on("auth:ready", _ => dashboardCtrlFunc($scope, $state, $course, userService));

}]);
