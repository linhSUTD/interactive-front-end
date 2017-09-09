var resetPasswordApp = angular.module('resetPasswordApp', ['service.auth', 'config', 'ui.router', 'ui.bootstrap']);

resetPasswordApp.config(['$httpProvider', function ($httpProvider) {
	$httpProvider.defaults.headers.post = {
		'Content-Type': undefined
	};

	$httpProvider.defaults.headers.put = {
		'Content-Type': undefined
	};
}]);

const PasswordErrors = {
	"unmatch": "Mật khẩu không trùng khớp"
};

resetPasswordApp.controller('resetPasswordCtrl', ['$timeout', '$scope', 'authService', 'settings',
	function ($timeout, $scope, authService, settings) {

		$scope.password = "";
		$scope.confirmPassword = "";
		var param = window.location.search.substring(1);

		if (param == null || param == "" || param == undefined || param.split("=")[0] != 'code') {
			$scope.alert = {
				type: 'danger',
				msg: "Mã xác nhận không hợp lệ."
			}
			$scope.hasAlert = true;
			return;
		}

		var code = param.split("=")[1];

		$scope.onSubmit = function () {
			var confirmPasswordElement = document.getElementById("confirmPassword");

			if ($scope.password !== $scope.confirmPassword) {
				$scope.alert = {
					type: 'danger',
					msg: "Mật khẩu không trùng khớp"
				}
				$scope.hasAlert = true;
				return;
			}

			authService.resetPassword(code, $scope.password).then(res => {
				location.href = settings.webUrl;
			}, err => {
				$scope.alert = {
					type: 'danger',
					msg: err.data.errors[0]
				}
				$scope.hasAlert = true;
			});
		}
	}]);
