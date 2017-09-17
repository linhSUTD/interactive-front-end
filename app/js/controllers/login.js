var loginModule = angular.module('page.login', ['service.academic']);

loginModule.config(function ($stateProvider, $urlRouterProvider) {

	$stateProvider
		.state('login', {
			url: '/login',
			controller: 'loginCtrl',
			templateUrl: '../partials/login.html'
		})
});

function loginCtrlFunc($scope, authService, settings, $state, $course) {

	$scope.user = {
		activationUrl: `${location.protocol}//${location.host}${settings.activationUrl}`
	};

	// Check if a user has signed in.
	var currentUser = authService.getCurrentUser();
	if (!!currentUser) {
		$state.go("dashboard");
		return;
	}

	// new | error
	$scope.state = "new";


	// Handle signing in
	$scope.login = function () {
		authService.login($scope.user).then(function (response) {
			$scope.$emit("user:loggedin");
			$course.recentCourses(null, null, 100, "descending").then(res => {
				if (res.data && res.data.length == 1) {
					$state.go('course.introduction', {
						courseId: res.data[0].id
					});
				} else {
					$state.go('home');
				}
			});
		}, function (error) {
			$scope.alertMessage = error.data.errors[0];
			$scope.state = "error";
		});
	}

	// Handle closing alert
	$scope.closeAlert = function () {
		$scope.state = "new";
	};
}

loginModule.controller('loginCtrl', ['$scope', 'authService', 'settings', '$state', '$course',
	function ($scope, authService, settings, $state, $course) {

		if ($scope.authReady) {
			loginCtrlFunc($scope, authService, settings, $state, $course);
			return;
		}

		$scope.$on("auth:ready", _ => loginCtrlFunc($scope, authService, settings, $state, $course));
	}
]);
