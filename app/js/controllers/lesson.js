var lessonModule = angular.module('page.lesson', ["directives", "service.academic", 'service.user']);

lessonModule.config(function ($stateProvider, $urlRouterProvider) {

	$stateProvider
		.state('course.lesson', {
			url: '/lesson/:lessonId/:index',
			templateUrl: '../../partials/lesson/lesson.html',
			controller: "lessonCtrl"
		});
});

function getGraphSrc(payload) {
	function hexToBase64(str) {
		//Generate hex array from hex string
		var hexArray = str.replace(/\r|\n/g, '').replace(/([\da-fA-F]{2}) ?/g, '0x$1 ').replace(/ +$/, '').split(' ');

		var CHUNK_SIZE = 0x8000; //Arbitrary number
		var index = 0;
		var length = hexArray.length;
		var result = '';
		var slice;
		//Passing too many arguments into fromCharCode gives `Maximum call stack size exceeded`.
		//We divide the hex array into pieces and pass these.
		while (index < length) {
			slice = hexArray.slice(index, index + CHUNK_SIZE);
			result += String.fromCharCode.apply(null, slice);
			index += CHUNK_SIZE;
		}
		return btoa(result);
	}

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

const outputTypeToClassMap = {
	"empty": "console-warning",
	"error": "console-error",
	"script-output": "console-output",
	"output": "console-output",
	"graph": "console-output"
};

function lessonCtrlFunc($timeout, $state, $scope, $stateParams, $q, userService, $exercise, $datacamp, $lesson) {
	var progress = {};
	var user = userService.getUser();
	var editor = null;
	var resultState = {};

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
		var outputWindow = document.getElementById("outputWindow");
		$datacamp.startSession(outputWindow.clientHeight * 0.5, outputWindow.clientWidth);

		$scope.exercise = null;
		$scope.output = "";
		$scope.graphPayload = "";
		$scope.resultType = "";

		editor = CodeMirror(document.getElementById("editor-tab"), {
			value: "",
			lineNumbers: true,
			mode: "python",
			extraKeys: {
				"F11": function (cm) {
					cm.setOption("fullScreen", !cm.getOption("fullScreen"));
				},
				"Esc": function (cm) {
					if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
				}
			}
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

	function setResult() {
		console.log(resultState);

		$scope.output = resultState.outputText;
		$scope.graphPayload = resultState.outputGraph;
		$scope.resultType = resultState.type;
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
	};

	$scope.submitcode = function () {
		if (!editor) {
			return;
		}

		var code = editor.getValue();
		console.log(code);
		if (!code.trim()) {
			return;
		}

		$datacamp.submitCode(code);
	};

	$scope.outputClass = function (type) {
		if (!type) {
			return "";
		}
		return outputTypeToClassMap[type];
	}

	init().then(ol => {
		$scope.outline = ol;
		$scope.selectedModule = $scope.outline[parseInt($stateParams.index)];
	});

	$datacamp.addBackendListener(rp => {
		resultState = {
			type: rp.type,
			payload: rp.payload
		};

		switch (rp.type) {
			default:
				break;
			case "script-output":
				resultState.outputText = rp.payload["output"];
				break;
			case "output":
				resultState.outputText = rp.payload;
				break;
			case "graph":
				resultState.outputGraph = getGraphSrc(rp.payload)
				break;
			case "empty":
				resultState.outputText = "Xảy ra vấn đề trong quá trình xử lý, xin thử lại";
				$('a[href="#console-tab"]').tab('show');
				break;
			case "error":
				resultState.outputText = rp.payload;
				$('a[href="#console-tab"]').tab('show');
				break;
		}

		$timeout(setResult, 0);
	});
}

lessonModule.controller('lessonCtrl', [
	'$timeout',
	'$state',
	'$scope',
	'$stateParams',
	'$q',
	'userService',
	'$exercise',
	'$datacamp',
	'$lesson', function ($timeout, $state, $scope, $stateParams, $q, userService, $exercise, $datacamp, $lesson) {
		if ($scope.authReady) {
			lessonCtrlFunc($timeout, $state, $scope, $stateParams, $q, userService, $exercise, $datacamp, $lesson);
			return;
		}

		$scope.$on("auth:ready",
			_ => lessonCtrlFunc($timeout, $state, $scope, $stateParams, $q, userService, $exercise, $datacamp, $lesson));
	}]);
