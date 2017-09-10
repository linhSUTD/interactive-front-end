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
		$scope.isSuccess = false;
		$scope.homePageUrl = "";

		var code = window.location.search.substring(1).split("=")[1];

		$scope.onSubmit = function () {

			var confirmPasswordElement = document.getElementById("confirmPassword");

			if ($scope.password !== $scope.confirmPassword) {

				$scope.alert = {
					type: 'danger',
					msg: "Mật khẩu không trùng khớp."
				}
				$scope.hasAlert = true;
				return;

			}

			authService.resetPassword(code, $scope.password).then(res => {

				$scope.alert = {
					type: 'success',
					msg: 'Thay đổi mật khẩu thành công.'
				}
				$scope.hasAlert = true;
				$scope.isSuccess = true;
				$scope.homePageUrl = `${settings.webUrl}/home`;

			}, err => {

				$scope.alert = {
					type: 'danger',
					msg: err.data.errors[0]
				}
				$scope.hasAlert = true;

			});
		}

		$scope.closeAlert = function () {
			$scope.hasAlert = false;
			$scope.alert = {};
		};
	}
]);
