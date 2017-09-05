var userModule = angular.module('page.user', ['duScroll']);

userModule.config(function ($stateProvider, $urlRouterProvider) {

	$stateProvider
		.state('user', {
			url: '/user',
			templateUrl: '../../partials/user/user.html'
		})
		.state('user.profile', {
			url: '/profile',
			controller: 'userProfileCtrl',
			templateUrl: '../../partials/user/userProfile.html'
		})
		.state('user.settings', {
			url: '/settings',
			controller: 'userSettingsCtrl',
			templateUrl: '../../partials/user/userSettings.html'
		})
})

userModule.controller('userProfileCtrl', ['$scope', '$stateParams', 'userService', function (
	$scope, $stateParams, userService) {

	$scope.user = userService.getUser();

}]);

function userSettingsCtrlFunc($state, $scope, $stateParams, userService) {
	$scope.user = userService.getUser();
	if (!$scope.user) {
		$state.go('login');
		return;
	}

	$scope.updateUser = function () {
		userService.update($scope.user.id, {
			name: $scope.user.name,
			contact: $scope.user.contact,
			gender: $scope.user.gender,
			workInfo: $scope.user.work
		}).then(res => {
			alert("updated");
		});
	}

	$scope.cancelUpdateUser = function () {

	}

	$scope.resetPassword = function () {

	}

	$scope.cancelResetPassword = function () {

	}
}

userModule.controller('userSettingsCtrl', ['$state', '$scope', '$stateParams', 'userService', function (
	$state, $scope, $stateParams, userService) {

	if ($scope.authReady) {
		userSettingsCtrlFunc($state, $scope, $stateParams, userService);
		return;
	}

	$scope.$on("auth:ready", _ => userSettingsCtrlFunc($state, $scope, $stateParams, userService));
}]);
