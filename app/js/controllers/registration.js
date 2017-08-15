/**
 * Created by nguyenlinh on 7/15/17.
 */
var registrationModule = angular.module('page.registration', []);

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
	$scope.register = function () {
		authService.register($scope.user).then(function (response) {
			$scope.$emit("user:loggedin");
			$state.go('home');
		}, function (error) {
			showPopUp("Error! " + error.data.message);
		});
	}
}]);
