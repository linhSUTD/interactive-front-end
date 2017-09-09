var resetPassword = angular.module('resetPasswordApp', ['ngCookies', 'service.auth', 'config', 'ui.router', 'ui.bootstrap']);

resetPassword.config(['$httpProvider', function ($httpProvider) {
	$httpProvider.defaults.headers.post = {
		'Content-Type': undefined
	};
}]);

resetPassword.config(function ($stateProvider, $urlRouterProvider) {
	$httpProvider.defaults.headers.post = {
		'Content-Type': undefined
	};
});

resetPassword.controller('resetPasswordCtrl', ['$scope', '$http', 'settings', 'authService', '$stateParams', function (
	$scope, $http, settings, authService, $stateParams) {

	$scope.alert = {};

	$scope.hasAlert = false;

	$scope.user = {
		password: "",
		confirmPassword: "",
		token: $stateParams.token
	};

	$scope.reset = function () {
		authService.resetPassword($scope.user).then(function (response) {
			$scope.alert = {
				type: 'success',
				msg: 'Thay đổi mật khẩu thành công.'
			}
			$scope.hasAlert = true;

		}, function(error){
			$scope.alert = {
				type: 'danger',
				msg: error.data.errors[0]
			}
			$scope.hasAlert = true;
		})
	}
}]);
