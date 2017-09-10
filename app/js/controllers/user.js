var userModule = angular.module('page.user', ['duScroll', 'service.auth', 'service.academic', 'ngCookies']);

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

/***
 * User Profile Page
 * @param $scope
 * @param $course
 * @param $stateParams
 * @param userService
 */
function userProfileCtrlFunc($state, $scope, $course, $stateParams, userService) {

	/**
	 * Get current user
	 */
	$scope.user = userService.getUser();
	if (!$scope.user) {
		$state.go('login');
		return;
	}

	/**
	 * Get achievements
	 */
	userService.achievements($scope.user.id).then(res => {
		$scope.achievements = res.data;
	});

	/**
	 * Get finished courses
	 */
	$scope.finishedCourses = [];

	$course.subscriptions($scope.user.id, null, null, 100, "descending").then(res => {
		if (res.status >= 400) {
			return;
		}
		$scope.finishedCourses = res.data.filter(c => c.completed);
	});

}

userModule.controller('userProfileCtrl', ['$scope', '$stateParams', 'userService', '$course', '$state',
	function ($scope, $stateParams, userService, $course, $state) {

	if ($scope.authReady) {
		userProfileCtrlFunc($state, $scope, $course, $stateParams, userService);
		return;
	}

	$scope.$on("auth:ready", _ => userProfileCtrlFunc($state, $scope, $course, $stateParams, userService));

}]);


/***
 * User Setting Page
 * @param $scope
 * @param $course
 * @param $stateParams
 * @param userService
 */
function userSettingsCtrlFunc($state, $scope, $stateParams, userService, authService, $cookies) {

	/**
	 * Get current user
	 */
	$scope.user = userService.getUser();
	if (!$scope.user) {
		$state.go('login');
		return;
	}

	$scope.alert = {};
	$scope.hasAlert = false;

	/**
	 * Change Avatar
	 */
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

	/**
	 * Update User Profile
	 */
	$scope.updateUser = function () {

		userService.update($scope.user.id, {

			name: $scope.user.name,
			contact: $scope.user.contact,
			gender: $scope.user.gender,
			workInfo: $scope.user.workInfo,
			avatar: $scope.avatarInput.files[0]

		}).then(res => {

			$scope.alert = {
				type: 'success',
				msg: 'Cập nhật thành công.'
			}
			$scope.hasAlert = true;

			userService.queryUser().then(res => {
				$scope.user = res.data;
				$cookies.put('currentUser', JSON.stringify(res.data));
			})

		}, function (error) {

			$scope.alert = {
				type: 'danger',
				msg: error.data.errors[0]
			}
			$scope.hasAlert = true;

		});
	}

	$scope.cancelUpdateUser = function () {
		$scope.user =  userService.getUser();
	}

	/**
	 * Reset User Password
	 */
	$scope.requestPasswordEmail = "";

	$scope.resetPassword = function () {
		authService.requestResetPassword($scope.requestPasswordEmail).then(res => {

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

userModule.controller('userSettingsCtrl', ['$state', '$scope', '$stateParams', 'userService', 'authService', '$cookies',
	function ($state, $scope, $stateParams, userService, authService, $cookies) {

		if ($scope.authReady) {
			userSettingsCtrlFunc($state, $scope, $stateParams, userService, authService, $cookies);
			return;
		}

		$scope.$on("auth:ready", _ => userSettingsCtrlFunc($state, $scope, $stateParams, userService, authService, $cookies));
	}

]);
