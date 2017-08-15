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

		$scope.user = {};
		$scope.login = function () {
			authService.login($scope.user).then(function (response) {
				$scope.$emit("user:loggedin");
				$state.go('home');
			}, function (error) {
				showPopUp(error.data.message);
			})
		}
	}]);
