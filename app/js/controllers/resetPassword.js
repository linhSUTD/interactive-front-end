/**
 * Created by nguyenlinh on 7/17/17.
 */
var resetPasswordModule = angular.module('page.resetPassword', []);

resetPasswordModule.config(function($stateProvider, $urlRouterProvider){

	$stateProvider
		.state('resetPassword', {
			url: '/resetPassword?token',
			controller: 'resetPasswordCtrl',
			templateUrl: '../partials/resetPassword.html'
		})
});

resetPasswordModule.controller('resetPasswordCtrl', ['$scope', '$http', 'settings', 'authService', '$stateParams',
	function ($scope, $http, settings, authService, $stateParams) {

		$scope.user = {
			password: "",
			confirmPassword: "",
			token: $stateParams.token
		};

		$scope.reset = function() {
			authService.resetPassword($scope.user).then(function(response) {

				console.log(response);
			})
		}
	}]);