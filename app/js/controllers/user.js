var userModule = angular.module('page.user', ['duScroll', 'service.auth']);

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

function userProfileCtrlFunc($scope, $stateParams, userService) {
	$scope.user = userService.getUser();

	userService.achievements($scope.user.id).then(res => {
		$scope.achievements = res.data;
	});
}

userModule.controller('userProfileCtrl', ['$scope', '$stateParams', 'userService', function ($scope, $stateParams, userService) {
	if ($scope.authReady) {
		userProfileCtrlFunc($scope, $stateParams, userService);
		return;
	}

	$scope.$on("auth:ready", _ => userProfileCtrlFunc($scope, $stateParams, userService));
}]);

function userSettingsCtrlFunc($state, $scope, $stateParams, userService, authService) {
	$scope.avatarInput = document.getElementById('avatar_input');
	$scope.newAvatarImg = document.getElementById('new_avatar');
	$scope.newAvatarImg.src = 'https://sg-avatars.b0.upaiyun.com/talent_blank.jpg-200w';

	var fr = new FileReader();
	fr.onload = function (e) {
		$scope.newAvatarImg.src = this.result;
	}

	$scope.avatarInput.addEventListener("change", function () {
		fr.readAsDataURL($scope.avatarInput.files[0]);
	});

	$scope.updateAvatar = function () {
		$scope.avatarInput.click();
	}

	$scope.alert = {};

	$scope.hasAlert = false;

	$scope.closeAlert = function () {
		$scope.hasAlert = false;
		$scope.alert = {};
	};

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
			workInfo: $scope.user.work,
			avatar: $scope.avatarInput.files[0]
		}).then(res => {
			$scope.alert = {
				type: 'success',
				msg: 'Cập nhật thành công.'
			}
			$scope.hasAlert = true;
			$scope.user = userService.getUser();
		}, function (error) {
			$scope.alert = {
				type: 'danger',
				msg: error.data.errors[0]
			}
			$scope.hasAlert = true;
		});
	}

	$scope.cancelUpdateUser = function () {

	}

	$scope.resetPassword = function () {
		authService.requestResetPassword($scope.requestPasswordEmail).then(res => {
			console.log("a reset password email has been sent");
		});
	}

	$scope.cancelResetPassword = function () {

	}
}

userModule.controller('userSettingsCtrl', ['$state', '$scope', '$stateParams', 'userService', 'authService',
	function ($state, $scope, $stateParams, userService, authService) {
		if ($scope.authReady) {
			userSettingsCtrlFunc($state, $scope, $stateParams, userService, authService);
			return;
		}

		$scope.$on("auth:ready", _ => userSettingsCtrlFunc($state, $scope, $stateParams, userService, authService));
	}]);
