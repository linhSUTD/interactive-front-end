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
	var currentIndex = $stateParams.index;

	if (user == null) {
		$state.go('login');
		return;
	}

	$scope.courseId = $stateParams.courseId;

	function initializeExercise() {

		// Load Disqus
		var url = window.location.href;

		var pathArray = url.split('/');

		var identifier = pathArray[pathArray.length - 1];

        DISQUS.reset({
            reload: true,
            config: function () {
                this.page.identifier = identifier;
                this.page.url = url;
            }
        });

		// Handle loading exercise
		$("#editor-tab").empty();
		var outputWindow = document.getElementById("outputWindow");

		if (!$datacamp.sessionStarted()) {
			$datacamp.startSession(outputWindow.clientHeight * 0.5, outputWindow.clientWidth);
		}

		$scope.exercise = null;
		$scope.output = "";
		$scope.graphPayload = "";
		$scope.resultType = "";
		$scope.hasAlert = false;
		$scope.alert = {};

		$scope.fullscreenRequest = function () {
			editor.setOption("fullScreen", true);
		}

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
			editor.setValue($scope.exercise.sampleCode || "");

			if (!res.data) {
				$exercise.saveProgress($scope.selectedModule.data.id, user.id, "");
				return;
			}
		});
	}

	function setModule(moduleItem) {
		if (!moduleItem || !$scope.outline || !$scope.outline.length) {
			return;
		}

		var index = moduleItem.type == "lesson" ? "" : moduleItem.data.id;

		if (index != currentIndex) {
			$state.go('course.lesson', {
				lessonId: $stateParams.lessonId,
				index: index
			}, { notify: false });
			currentIndex = index;
		}

		$scope.selectedModule = moduleItem;

		if (moduleItem.type == "exercise") {
			$timeout(initializeExercise, 0);
		}
	}

	function setResult() {
		$scope.busy = resultState.type == "executing";
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
		if (!editor || !!$scope.busy) {
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
		var item = !$stateParams.index ? $scope.outline[0] : $scope.outline.filter(i => i.data.id == $stateParams.index)[0];
		setModule(item);
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
				resultState.outputText = "Code chưa hiệu quả, thời gian chạy quá lâu";
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

    // new | error | sent
    $scope.state = "exercise";

	$scope.changeState = function() {
		$scope.state = 'solution';
	}
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
