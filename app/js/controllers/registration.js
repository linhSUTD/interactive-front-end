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

	var currentUser = authService.getCurrentUser();

	if (!!currentUser) {
		$state.go("dashboard");
		return;
	}

	$scope.user = {
		activationUrl: `${location.protocol}//${location.host}${settings.activationUrl}`
	};

	// new | error | sent
	$scope.state = "new";
	$scope.alert = {};
	$scope.hasAlert = false;

	$scope.register = function () {

		authService.register($scope.user).then(function (response) {
			$scope.state = "sent";
		}, function (error, msg) {
			$scope.alertMessage = error.data.errors[0];
			$scope.state = "error";
		});
	}

	$scope.closeAlert = function () {
		$scope.hasAlert = false;
		$scope.alert = {};
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
