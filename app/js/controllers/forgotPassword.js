var forgotPasswordModule = angular.module('page.forgotPassword', ['service.auth', 'config']);

forgotPasswordModule.config(function ($stateProvider, $urlRouterProvider) {

	$stateProvider
		.state('forgotPassword', {
			url: '/forgotPassword',
			controller: 'forgotPasswordCtrl',
			templateUrl: '../partials/forgotPassword.html'
		});
});

function forgotPasswordCtrlFunc($state, $scope, $http, settings, authService) {

	var currentUser = authService.getCurrentUser();

	if (!!currentUser) {
		$state.go('dashboard');
		return;
	}

	$scope.alert = {};
	$scope.hasAlert = false;
	$scope.user = {
		email: ""
	};

	$scope.onSubmit = function () {
		authService.requestResetPassword($scope.user.email).then(res => {

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

		});
	}

	$scope.closeAlert = function () {
		$scope.hasAlert = false;
		$scope.alert = {};
	};
}

forgotPasswordModule.controller('forgotPasswordCtrl', ['$state', '$scope', '$http', 'settings', 'authService',
	function ($state, $scope, $http, settings, authService) {

		if ($scope.authReady) {
			forgotPasswordCtrlFunc($state, $scope, $http, settings, authService);
			return;
		}

		$scope.$on("auth:ready", _ => forgotPasswordCtrlFunc($state, $scope, $http, settings, authService));

	}
]);
