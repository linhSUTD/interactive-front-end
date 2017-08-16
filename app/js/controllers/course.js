var courseModule = angular.module('page.course', ['duScroll', 'service.academic', 'service.user']);

courseModule.config(function ($stateProvider, $urlRouterProvider) {

	$stateProvider
		.state('course', {
			url: '/course/:courseId',
			templateUrl: '../../partials/course/course.html'
		})
		.state('course.introduction', {
			url: '/intro',
			controller: 'courseIntroductionCtrl',
			templateUrl: '../../partials/course/introduction.html'
		})
		.state('course.home', {
			url: '/detail',
			controller: 'courseHomePageCtrl',
			templateUrl: '../../partials/course/courseHomePage.html'
		});
});

courseModule.controller('courseIntroductionCtrl', [
	'$scope',
	'$stateParams',
	'$state',
	'courseService',
	'userService', function ($scope, $stateParams, $state, courseService, userService) {

		$scope.course = null;
		$scope.author = null;
		$scope.reviews = [];
		$scope.enrolling = false;
		$scope.lessons = [];
		$scope.registration = null;

		$scope.onEnrollClick = function () {
			if (user == null) {
				$state.go('registration');
				return;
			}

			if (!$scope.registration) {
				courseService.register(user.id, $scope.course.id);
			}

			$state.go('course.home', { courseId: $scope.course.id });
		}

		var user = userService.getUser();

		courseService.get($stateParams.courseId).then(res => {
			$scope.course = res.data;
		}, err => {
		}).then(_ => {
			if (!user || !$scope.course) {
				return;
			}

			courseService.registration(user.id, $scope.course.id).then(r => {
				$scope.registration = !r.data ? null : r.data;
			});

			userService.getAuthor($scope.course.authorId).then(r => {
				$scope.author = r.data;
			}, errA => {

			});
		});

		courseService.lessons($stateParams.courseId).then(res => {
			$scope.lessons = res.data;
		});

		courseService.reviews($stateParams.courseId).then(res => {
			$scope.reviews = res.data;
		});


	}]);

courseModule.controller('courseHomePageCtrl', [
	'$q',
	'$scope',
	'$state',
	'$stateParams',
	'userService',
	'courseService', function ($q, $scope, $state, $stateParams, userService, courseService) {

		var user = userService.getUser();
		if (!user) {
			$state.go('registration');
			return;
		}

		$scope.lessons = [];
		$scope.course = null;
		var progress = null;
		var lessons = [];

		function init() {
			var defer = $q.defer();

			var progressPromise = courseService.progress(user.id, $stateParams.courseId).then(res => {
				progress = res.data;
			}, errC => defer.reject(errC));

			var lessonPromise = courseService.lessons($stateParams.courseId).then(res => {
				lessons = res.data;
			}, errL => defer.reject(errL));

			$q.all([progressPromise, lessonPromise]).then(_ => {
				defer.resolve();
			});

			return defer.promise;
		}

		init().then(_ => {
			if (!lessons || lessons.length == 0) { return; }
			if (!progress) { progress = {}; }

			for (var i = 0; i < lessons.length; i++) {
				if (progress[lessons[i].id] === null || progress[lessons[i].id] === undefined) {
					continue;
				}

				lessons[i].progress = Math.round(progress[lessons[i].id] * 100);
			}

			$scope.lessons = lessons;
		});

		courseService.get($stateParams.courseId).then(res => {
			$scope.course = res.data;
		});
	}]);
