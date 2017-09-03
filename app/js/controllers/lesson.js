var lessonModule = angular.module('page.lesson', ["directives", "service.academic", 'service.user']);

lessonModule.config(function ($stateProvider, $urlRouterProvider) {

	$stateProvider
		.state('course.lesson', {
			url: '/lesson/:lessonId/:index',
			templateUrl: '../../partials/lesson/lesson.html',
			controller: "lessonCtrl"
		});
})

lessonModule.controller('lessonCtrl', [
	'$timeout',
	'$state',
	'$scope',
	'$stateParams',
	'$q',
	'userService',
	'$exercise',
	'$lesson', function ($timeout, $state, $scope, $stateParams, $q, userService, $exercise, $lesson) {

		var progress = {};
		var user = userService.getUser();

		if (user == null) {
			$state.go('login');
			return;
		}

		function init() {
			var defer = $q.defer();
			var lessonPromise = $lesson.get($stateParams.lessonId).then(res => {
				if (!res.data) { return; }
				$scope.lesson = res.data;
			});
			var exercisePromise = $lesson.exercises($stateParams.lessonId).then(res => {
				$scope.exerciseSummaries = res.data;
			});
			var progressPromise = $lesson.progress(user.id, $stateParams.lessonId).then(res => {
				progress = res.data || {};
			});

			$q.all([lessonPromise, exercisePromise]).then(_ => {
				var outline = [{
					type: "lesson",
					data: $scope.lesson
				}];

				outline = outline.concat($scope.exerciseSummaries.map(es => {
					es.completed = !!progress[es.id];
					return {
						type: "exercise",
						data: es
					};
				}));

				defer.resolve(outline);
			});

			return defer.promise;
		}

		function initializeExercise() {
			$("#editor-tab").empty();

			$scope.exercise = null;
			$scope.output = null;
			$scope.graphPayload = null;

			var editor = CodeMirror(document.getElementById("editor-tab"), {
				value: "",
				fullScreen: false,
				lineNumbers: true,
				mode: "python"
			});

			editor.setSize(null, "100%");

			$exercise.get($scope.selectedModule.data.id).then(res => {
				if (!res.data) {
					return;
				}

				$scope.exercise = res.data;
				editor.setValue(res.data.sampleCode);
			});
		}

		$scope.lesson = null;
		$scope.outline = [];
		$scope.exerciseSummaries = [];
		$scope.selectedModule = null;

		$scope.onItemSelect = function (item) {
			$('#lesson-outline').modal('toggle');
			$scope.selectedModule = item;

			if (item.type == "exercise") {
				$timeout(initializeExercise, 0);
			}
		}

		init().then(ol => {
			$scope.outline = ol;
			$scope.selectedModule = $scope.outline[parseInt($stateParams.index)];
		});
	}]);

lessonModule.controller('exerciseCtrl', ['$scope', function ($scope) {

}]);
