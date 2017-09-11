var registrationModule = angular.module('page.registration', ['ui.bootstrap']);

registrationModule.config(function ($stateProvider, $urlRouterProvider) {

	$stateProvider
		.state('registration', {
			url: '/registration',
			controller: 'registrationCtrl',
			templateUrl: '../partials/registration.html'
		})
});

function registrationCtrlFunc($scope, authService, settings, $state) {

	$scope.user = {
		activationUrl: `${location.protocol}//${location.host}${settings.activationUrl}`
	};

	// Check if a user has signed in.
	var currentUser = authService.getCurrentUser();
	if (!!currentUser) {
		$state.go("dashboard");
		return;
	}

	// new | error | sent
	$scope.state = "new";

	// Handle user registration
	$scope.register = function () {

		authService.register($scope.user).then(function (response) {
			$scope.state = "sent";
		}, function (error, msg) {
			$scope.alertMessage = error.data.errors[0];
			$scope.state = "error";
		});
	}

	// Handle closing alert
	$scope.closeAlert = function () {
		$scope.state = "new";
	};
}

registrationModule.controller('registrationCtrl', ['$scope', 'authService', 'settings', '$state',
	function ($scope, authService, settings, $state) {

		if ($scope.authReady) {
			registrationCtrlFunc($scope, authService, settings, $state);
			return;
		}

		$scope.$on("auth:ready", _ => registrationCtrlFunc($scope, authService, settings, $state));
	}
]);
