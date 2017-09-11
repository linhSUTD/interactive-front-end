var lessonModule = angular.module('page.lesson', ["directives", "service.academic", 'service.user']);

const SAVE_SOLUTION_INTERVAL = 5000;

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

		// Generate hex array from hex string
		var hexArray = str.replace(/\r|\n/g, '').replace(/([\da-fA-F]{2}) ?/g, '0x$1 ').replace(/ +$/, '').split(' ');

		var CHUNK_SIZE = 0x8000; //Arbitrary number
		var index = 0;
		var length = hexArray.length;
		var result = '';
		var slice;

		// Passing too many arguments into fromCharCode gives `Maximum call stack size exceeded`.
		// We divide the hex array into pieces and pass these.
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
	var saveInterval = 0;

	if (user == null) {
		$state.go('login');
		return;
	}

	function isLessonComplete() {
		var defer = $q.defer();
		$lesson.progress($stateParams.lessonId, user.id).then(res => {
			defer.resolve(!!res.data);
		}, _ => defer.resolve(false));

		return defer.promise;
	}

	function checkLessonComplete() {
		isLessonComplete().then(res => {
			if (res) {
				$state.go('course.home', { courseId: $scope.outline[0].data.courseId });
				return;
			}

			//move on to the next exercise
			var selectedIndex = $scope.outline.indexOf($scope.selectedModule);
			if (selectedIndex < 0) {
				return;
			}
			setModule($scope.outline[(selectedIndex + 1) % $scope.outline.length]);
		});
	}

	function initializeExercise() {
		$("#editor-tab").empty();
		var outputWindow = document.getElementById("outputWindow");
		$datacamp.startSession(outputWindow.clientHeight * 0.5, outputWindow.clientWidth);

		$scope.exercise = null;
		$scope.output = "";
		$scope.graphPayload = "";
		$scope.resultType = "";
		$scope.hasAlert = false;
		$scope.alert = {};

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

		}).then(_ => $exercise.progress($scope.selectedModule.data.id, user.id)).then(res => {

			if (!res.data) {
				editor.setValue($scope.exercise.sampleCode || "");
				return;
			}

			editor.setValue(res.data.currentSolution || "");
		});
	}

	function setModule(moduleItem) {

		$scope.selectedModule = moduleItem;

		if (moduleItem.type == "exercise") {
			$timeout(initializeExercise, 0);
		}
	}

	function setResult() {

		$scope.output = resultState.outputText;
		$scope.graphPayload = resultState.outputGraph;
		$scope.resultType = resultState.type;

		if (!editor) {
			return;
		}

		if (resultState.type == "script-output" || resultState.type == "output") {
			$exercise.saveProgress($scope.selectedModule.data.id, user.id, editor.getValue(), resultState.outputText).then(r => {
				if (!r.data) {
					$scope.alert = {
						type: 'danger',
						msg: 'Kết quả không chính xác.'
					}
					$scope.hasAlert = true;
				} else {
					$scope.alert = {
						type: 'success',
						msg: 'Kết quả chính xác.'
					}
					$scope.hasAlert = true;
					checkLessonComplete();
				}
			});
		}
	}

	$scope.outline = [];
	$scope.exerciseSummaries = [];
	$scope.selectedModule = null;

	$scope.onItemSelect = function (item) {
		$('#lesson-outline').modal('toggle');
		setModule(item);
	};

	$scope.submitcode = function () {
		if (!editor) {
			return;
		}

		var code = editor.getValue();
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

	$lesson.outline($stateParams.lessonId, user.id).then(ol => {
		$scope.outline = ol;
		setModule($scope.outline[parseInt($stateParams.index)]);
	});

	$datacamp.addBackendListener(rp => {
		resultState = {
			type: rp.type,
			payload: rp.payload
		};

		switch (rp.type) {
			default:
				return;
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


	$scope.goPrevious = function () {
		//move on to the next exercise
		var selectedIndex = $scope.outline.indexOf($scope.selectedModule);
		if (selectedIndex == 0) {
			setModule($scope.outline[0]);
			return;
		}
		setModule($scope.outline[(selectedIndex - 1) % $scope.outline.length]);
	}

	$scope.goForward = function () {
		//move on to the next exercise
		var selectedIndex = $scope.outline.indexOf($scope.selectedModule);
		if (selectedIndex < 0) {
			return;
		}
		setModule($scope.outline[(selectedIndex + 1) % $scope.outline.length]);
	}

	$scope.closeAlert = function () {
		$scope.hasAlert = false;
		$scope.alert = {};
	};
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
