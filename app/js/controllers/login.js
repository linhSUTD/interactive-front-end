var loginModule = angular.module('page.login', []);

loginModule.config(function ($stateProvider, $urlRouterProvider) {

	$stateProvider
		.state('login', {
			url: '/login',
			controller: 'loginCtrl',
			templateUrl: '../partials/login.html'
		})
});

function loginCtrlFunc($scope, authService, settings, $state) {

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
			$state.go('home');
		}, function (error) {
			$scope.alertMessage = error.data.errors[0];
			$scope.state = "error";
		})
	}

	// Handle closing alert
	$scope.closeAlert = function () {
		$scope.state = "new";
	};
}

loginModule.controller('loginCtrl', ['$scope', 'authService', 'settings', '$state',
	function ($scope, authService, settings, $state) {

		if ($scope.authReady) {
			loginCtrlFunc($scope, authService, settings, $state);
			return;
		}

		$scope.$on("auth:ready", _ => loginCtrlFunc($scope, authService, settings, $state));
	}
]);
