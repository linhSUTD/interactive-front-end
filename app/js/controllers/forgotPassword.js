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

	$scope.user = {
		email: ""
	};

	$scope.forgot = function () {

		authService.forgotPassword($scope.user).then(function (response) {

			showPopUp("We have sent you password reset instructions.");

		}, function (error) {

			showPopUp(error.data.error);
		})
	}
}]);
