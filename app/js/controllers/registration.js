/**
 * Created by nguyenlinh on 7/15/17.
 */
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
		activationUrl: settings.activationUrl
	};
	$scope.alert = {};
	$scope.hasAlert = false;

	$scope.register = function () {

		authService.register($scope.user).then(function (response) {

			$scope.alert = {
				type: 'success',
				msg: 'Đăng ký thành công! Chúng tôi đã gửi email xác nhận cho bạn.'
			}
			$scope.hasAlert = true;

		}, function (error, msg) {

			$scope.alert = {
				type: 'danger',
				msg: error.data.errors[0]
			}
			$scope.hasAlert = true;

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
