
var firstCourseModule = angular.module('page.firstCourse', ['ngCookies']);

firstCourseModule.config(function ($stateProvider, $urlRouterProvider) {

	$stateProvider
		.state('firstcourse', {
			url: '/firstcourse',
			controller: 'firstCourseCtrl',
			templateUrl: '../../partials/firstcourse.html'
		})
		.state('firstcourse.introduction', {
			url: '/introduction',
			controller: 'firstCourse.Introduction.Ctrl',
			templateUrl: '../../partials/firstcourse/introduction.html'
		})
		.state('firstcourse.content', {
			url: '/content',
			controller: 'firstCourse.Content.Ctrl',
			templateUrl: '../../partials/firstcourse/content.html'
		})
})

firstCourseModule.run(function ($cookies, $state, settings) {
	if (!$cookies.get('token')) {
		window.location = settings.webUrl + settings.pageUrl.HOME;
	}
})

firstCourseModule.controller('firstCourseCtrl', ['$scope', function ($scope) {
	$scope.changeLoginState(true);
}]);

firstCourseModule.controller('firstCourse.Introduction.Ctrl', ['$scope', '$state', function ($scope, $state) {
	$scope.registerCourse = function () {
		// Call to server

		// Redirect to content page
		$state.go('firstcourse.content');
	}
}]);

firstCourseModule.controller('firstCourse.Content.Ctrl', ['$scope', '$state', 'ExerciseLoader', 'BackendSessionManager', function ($scope, $state, exerciseLoader, backendSessionManager) {
	function createImageSrc(payload) {
		if (payload.lastIndexOf("http", 0) === 0) {
			return payload;
		}
		// New SVGs (from Python) com in base64 - they always start with PD94
		if (payload.startsWith('PD94')) {
			return 'data:image/svg+xml;base64,' + payload;
		}
		// PNGs (from R) come in hex; need to convert to base 64
		return 'data:image/png;base64,' + hexToBase64(payload);
	}

	require.config({ paths: { 'vs': 'https://microsoft.github.io/monaco-editor/node_modules/monaco-editor/min/vs' } });

	var initialized = false;
	var editor;
	function loadNewExercise() {
		$scope.graphSrc = "";
		$scope.outputText = null;

		var exercise = exerciseLoader.getExercise(2);
		window.editor.setValue(exercise.pre_exercise_code);

		return exercise;
	}

	function controllerMain() {
		initialized = true;

		window.editor = monaco.editor.create(document.getElementById('editor_panel'), {
			language: 'python',
			theme: 'vs-dark'
		});

		editor = window.editor;

		var exercise = loadNewExercise();
		var backend = backendSessionManager.createBackend(exercise.language, exercise);
	}

	function handleCodeOutput(output) {
		console.log(output);
		$scope.graphSrc = "null";
		$scope.outputText = null;
		for (var i = 0; i < output.length; i++) {
			if (output[i].type == "graph") {
				$scope.graphSrc = createImageSrc(output[i].payload);
			} else if (output[i].type == "output") {
				$scope.outputText = output[i].payload;
			}
		}
	}

	$scope.getGraphSrc = function () {
		return $scope.graphSrc || "";
	}

	$scope.onLoadNew = function () {
		loadNewExercise();
	}

	$scope.onSubmit = function () {
		// If there is no SCT, simply do a console command
		var action = backendSessionManager.runConsole;
		var code = window.editor.getValue();
		console.log(code);
		if (backendSessionManager.sessionActive()) {
			//Session is already active, just execute the code.

			action(code, true, data => handleCodeOutput(data));
		} else {
			// The function that will get called after the session is initialized properly.
			var turnOffListener = $scope.$on('session::ready', function () {
				turnOffListener();
				action(code, true, data => handleCodeOutput(data));
			});

			//First create a session
			backendSessionManager.startSession();
		}
	}

	require(['vs/editor/editor.main'], controllerMain);
}]);
