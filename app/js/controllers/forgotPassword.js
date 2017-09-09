/**
 * Created by nguyenlinh on 7/17/17.
 */
var forgotPasswordModule = angular.module('page.forgotPassword', []);

forgotPasswordModule.config(function ($stateProvider, $urlRouterProvider) {

	$stateProvider
		.state('forgotPassword', {
			url: '/forgotPassword',
			controller: 'forgotPasswordCtrl',
			templateUrl: '../partials/forgotPassword.html'
		})
});

forgotPasswordModule.controller('forgotPasswordCtrl', ['$scope', '$http', 'settings', 'authService', function ($scope, $http, settings, authService) {

	$scope.alert = {};

	$scope.hasAlert = false;

	$scope.user = {
		email: ""
	};

	$scope.forgot = function () {

		authService.forgotPassword($scope.user).then(function (response) {

			$scope.alert = {
				type: 'success',
				msg: 'Chúng tôi đã gửi email thay đổi mật khẩu cho bạn.'
			}
			$scope.hasAlert = true;

		}, function (error) {

			$scope.alert = {
				type: 'danger',
				msg: error.data.errors[0]
			}
			$scope.hasAlert = true;
		})
	}
}]);
