var courseModule = angular.module('page.course', ['duScroll', 'service.academic', 'service.user', 'ui.bootstrap']);

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

/**
 * Couse Introduction Page
 */
courseModule.controller('courseIntroductionCtrl', [
	'$scope',
	'$stateParams',
	'$state',
	'$course',
	'userService', function ($scope, $stateParams, $state, $course, userService) {

		$scope.course = null;
		$scope.author = null;
		$scope.reviews = [];
		$scope.enrolling = false;
		$scope.lessons = [];
		$scope.registration = null;

		/**
		 * Load course reviews
		 */
		function loadReviews() {
			$course.reviews($stateParams.courseId).then(res => {
				$scope.reviews = res.data;
			});
		}

		/**
		 * Handle submitting course reviews
		 */
		$scope.review_onSubmit = function () {
			if (!$scope.reviewScore || !$scope.reviewTitle) {
				return;
			}

			$course.postReview($stateParams.courseId, $scope.reviewTitle, $scope.review, $scope.reviewScore).then(r => {
				$scope.reviewScore = undefined;
				$scope.review = null;
				$scope.reviewTitle = null;
				loadReviews();
			});
		}

		/**
		 * Handle course enrolment
		 */
		$scope.onEnrollClick = function () {
			if (user == null) {
				$state.go('registration');
				return;
			}

			if (!$scope.registration) {
				$course.register(user.id, $scope.course.id).then(res => {
					$state.go('course.home', { courseId: $scope.course.id });
				});

				return;
			}

			$state.go('course.home', { courseId: $scope.course.id });
		}

		/**
		 * Load required information
		 */
		var user = userService.getUser();

		$course.get($stateParams.courseId).then(res => {

			$scope.course = res.data;

		}).then(_ => {

			userService.author($scope.course.authorId).then(r => {
				$scope.author = r.data;
			});

			if (!user || !$scope.course) {
				return;
			}

			$course.subscription(user.id, $scope.course.id).then(r => {
				$scope.registration = !r.data ? null : r.data;
			});

		});

		$course.lessons($stateParams.courseId).then(res => {
			$scope.lessons = res.data;
		});

		loadReviews();

	}
]);

/**
 * Course Home Page
 * @param $timeout
 * @param $q
 * @param $scope
 * @param $state
 * @param $stateParams
 * @param userService
 * @param $lesson
 * @param $course
 */
function courseHomePageCtrlFunc($timeout, $q, $scope, $state, $stateParams, userService, $lesson, $course) {

	var user = userService.getUser();
	if (!user) {
		$state.go('login');
		return;
	}

	var outlines = {};
	$scope.lessons = [];
	$scope.course = null;
	var progress = null;
	var lessons = [];

	/**
	 * Query required information
	 */
	function init() {
		var defer = $q.defer();

		var subPromise = userService.subscription(user.id, $stateParams.courseId).then(res => {
			if (!res.data) {
				defer.reject("NoSub");
				return;
			}
		}, err => defer.reject(err));

		var progressPromise = $course.progress(user.id, $stateParams.courseId).then(res => {
			progress = res.data;
		}, errC => defer.reject(errC));

		var lessonPromise = $course.lessons($stateParams.courseId).then(res => {
			lessons = res.data;
		}, errL => defer.reject(errL));

		$q.all([subPromise, progressPromise, lessonPromise]).then(_ => {
			defer.resolve();
		});

		return defer.promise;
	}

	/**
	 * Query lesson details
	 */
	$scope.showLessonInDetail = function (lesson, index) {
		if (!!lesson.outline) {
			lesson.outline = null;
			$scope.lessons[index] = lesson;
			return;
		}

		if (!!outlines[lesson.id]) {
			lesson.outline = outlines[lesson.id];
			return;
		}

		$lesson.outline(lesson.id, user.id).then(res => {
			outlines[lesson.id] = res;
			lesson.outline = res;
		});
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

	}, err => {
		if (err == "NoSub") {
			$state.go('course.introduction', { courseId: $stateParams.courseId });
		}
	});

	/**
	 * Query course information
	 */
	$course.get($stateParams.courseId)
		.then(res => {
			$scope.course = res.data;
		})
		.then(_ => userService.author($scope.course.authorId))
		.then(r => $scope.author = r.data);
}

courseModule.controller('courseHomePageCtrl', [
	'$timeout',
	'$q',
	'$scope',
	'$state',
	'$stateParams',
	'userService',
	'$lesson',
	'$course', function ($timeout, $q, $scope, $state, $stateParams, userService, $lesson, $course) {

		if ($scope.authReady) {
			courseHomePageCtrlFunc($timeout, $q, $scope, $state, $stateParams, userService, $lesson, $course);
			return;
		}

		$scope.$on("auth:ready", _ => courseHomePageCtrlFunc($timeout, $q, $scope, $state, $stateParams, userService, $lesson, $course));
	}
]);
