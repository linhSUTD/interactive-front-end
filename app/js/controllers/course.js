var courseModule = angular.module('page.course', ['duScroll', 'service.course', 'service.auth']);

courseModule.config(function ($stateProvider, $urlRouterProvider) {

	$stateProvider
		.state('course', {
			url: '/course/:courseId',
			templateUrl: '../../partials/course/course.html'
		})
		.state('course.introduction', {
			url: '/introduction',
			controller: 'courseIntroductionCtrl',
			templateUrl: '../../partials/course/introduction.html'
		})
		.state('course.home', {
			url: '/welcome',
			controller: 'courseHomePageCtrl',
			templateUrl: '../../partials/course/courseHomePage.html'
		});
});

courseModule.controller('courseIntroductionCtrl', ['$scope', '$stateParams', 'courseService', 'userService', function (
	$scope, $stateParams, courseService, userService) {

	$scope.course = null;
	$scope.author = null;
	$scope.lessons = [];
	$scope.reviews = [];

	courseService.get($stateParams.courseId).then(res => {
		$scope.course = res.data;

	}, err => {
	}).then(_ => {
		userService.getAuthor($scope.course.authorId).then(r => {
			$scope.author = r.data;
		}, errA => {

		});
	});

	courseService.getLessons($stateParams.courseId).then(res => {
		$scope.lessons = res.data;
	});

	courseService.getReviews($stateParams.courseId).then(res => {
		$scope.reviews = res.data;
	});
}]);

courseModule.controller('courseHomePageCtrl', ['$scope', '$stateParams', 'userService', function (
	$scope, $stateParams, userService) {

}]);
