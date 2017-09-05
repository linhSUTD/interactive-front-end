/**
 * Created by nguyenlinh on 7/15/17.
 */
var loginModule = angular.module('page.login', []);

loginModule.config(function ($stateProvider, $urlRouterProvider) {

	$stateProvider
		.state('login', {
			url: '/login',
			controller: 'loginCtrl',
			templateUrl: '../partials/login.html'
		})
})

loginModule.controller('loginCtrl', ['$scope', 'authService', 'settings', '$state',
	function ($scope, authService, settings, $state) {

		$scope.alert = {};

		$scope.hasAlert = false;

		$scope.user = {
			activationUrl: settings.activationUrl
		};

		$scope.login = function () {
			authService.login($scope.user).then(function (response) {

				$scope.$emit("user:loggedin");

				$state.go('home');

			}, function (error) {

				$scope.alert = {
					type: 'danger',
					msg: error.data.message
				}
				$scope.hasAlert = true;

			})
		}

		$scope.closeAlert = function() {
			$scope.hasAlert = false;
			$scope.alert = {};
		};
	}]);
