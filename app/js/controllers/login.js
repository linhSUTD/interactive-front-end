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

	var currentUser = authService.getCurrentUser();

	if (!!currentUser) {
		$state.go("dashboard");
		return;
	}

	$scope.alert = {};
	$scope.hasAlert = false;
	$scope.user = {
		activationUrl: `${location.protocol}//${location.protocol}//${location.host}${settings.activationUrl}`
	};

	$scope.login = function () {

		authService.login($scope.user).then(function (response) {

			$scope.$emit("user:loggedin");
			$state.go('home');

		}, function (error) {

			$scope.alert = {
				type: 'danger',
				msg: error.data.errors[0]
			}
			$scope.hasAlert = true;

		})

	}

	$scope.closeAlert = function () {
		$scope.hasAlert = false;
		$scope.alert = {};
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
