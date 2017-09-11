var homeModule = angular.module('page.home', ['service.academic']);

homeModule.config(function ($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise('/home');

	$stateProvider
		.state('home', {
			url: '/',
			controller: 'homeCtrl',
			templateUrl: '../partials/home.html'
		});
})

function getSummaries($course, $lesson, $exercise, userService, $q) {

	var defer = $q.defer();

	var courseCount = 0, lessonCount = 0, exerciseCount = 0, userCount = 0;
	var err = null;

	var coursePromise = $course.count().then(res => courseCount = res.data, e => err = e);
	var lessonPromise = $lesson.count().then(res => lessonCount = res.data, e => err = e);
	var exercisePromise = $exercise.count().then(res => exerciseCount = res.data, e => err = e);
	var userPromise = userService.count().then(res => userCount = res.data, e => err = e);

	$q.all([coursePromise, lessonPromise, exercisePromise, userPromise]).then(_ => {

		if (!!err) {
			defer.reject(err);
			return;
		}

		defer.resolve({
			courseCount: courseCount,
			lessonCount: lessonCount,
			exerciseCount: exerciseCount,
			userCount: userCount
		});
	});

	return defer.promise;
}

function homeCtrlFunc($q, $scope, $course, $lesson, $exercise, userService, $state) {

	// Check if a user has signed in.
	var user = userService.getUser();
	if (!!user) {
		$state.go('dashboard');
		return;
	}

	// Query product insights
	getSummaries($course, $lesson, $exercise, userService, $q).then(res => {
		$scope.summaries = res;
	});
}

homeModule.controller('homeCtrl', [
	'$q',
	'$scope',
	'$course',
	'$lesson',
	'$exercise',
	'userService',
	'$state', function ($q, $scope, $course, $lesson, $exercise, userService, $state) {

		if ($scope.authReady) {
			homeCtrlFunc($q, $scope, $course, $lesson, $exercise, userService, $state);
			return;
		}

		$scope.$on("auth:ready", _ => homeCtrlFunc($q, $scope, $course, $lesson, $exercise, userService, $state));
	}
]);
