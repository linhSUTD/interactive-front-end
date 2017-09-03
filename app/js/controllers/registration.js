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

registrationModule.controller('registrationCtrl', ['$scope', 'authService', 'settings', '$state', function (
	$scope, authService, settings, $state) {

	$scope.user = {};

	$scope.alerts = {};

	$scope.hasAlert = false;

	$scope.register = function () {

		$scope.user.activationUrl = settings.activationUrl;

		authService.register($scope.user).then(function (response) {
			$scope.$emit("user:loggedin");
			$scope.alert = {
				type: 'success',
				msg: 'Đăng ký thành công! Chúng tôi đã gửi email xác nhận cho bạn.'
			}
			$scope.hasAlert = true;
		}, function (error, msg) {

			$scope.alert = {
				type: 'danger',
				msg: error.data.message
			}
			$scope.hasAlert = true;
		});
	}

	$scope.closeAlert = function() {
		$scope.hasAlert = false;
		$scope.alert = {};
	};
}]);
