var resetPasswordApp = angular.module('resetPasswordApp', ['service.auth', 'config', 'ui.router', 'ui.bootstrap']);

resetPasswordApp.config(['$httpProvider', function ($httpProvider) {
	$httpProvider.defaults.headers.post = {
		'Content-Type': undefined
	};

	$httpProvider.defaults.headers.put = {
		'Content-Type': undefined
	};
}]);

resetPasswordApp.controller('resetPasswordCtrl', ['$timeout', '$scope', 'authService', 'settings',
	function ($timeout, $scope, authService, settings) {

		$scope.password = "";
		$scope.confirmPassword = "";

		// new | error | sent
		$scope.state = "new";

		// extract code from URL
		var code = window.location.search.substring(1).split("=")[1];

		// Handle resetting password
		$scope.onSubmit = function () {

			var confirmPasswordElement = document.getElementById("confirmPassword");

			if ($scope.password !== $scope.confirmPassword) {
				$scope.alertMessage = "Mật khẩu không trùng khớp.";
				$scope.state = "error";
				return;
			}

			authService.resetPassword(code, $scope.password).then(res => {
				$scope.state = "sent";
			}, err => {
				$scope.alertMessage = error.data.errors[0];
				$scope.state = "error";
			});
		}

		// Handle closing alert
		$scope.closeAlert = function () {
			$scope.state = "new";
		};
	}
]);
