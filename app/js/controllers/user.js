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
 */
function userProfileCtrlFunc($state, $scope, $course, $stateParams, userService) {

	// Check if a user has signed in.
	$scope.user = userService.getUser();
	if (!$scope.user) {
		$state.go('login');
		return;
	}

	// Get achievements
	userService.achievements($scope.user.id).then(res => {
		$scope.achievements = res.data;
	});

	// Get finished courses
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
 */
function userSettingsCtrlFunc($state, $scope, $stateParams, userService, authService, $cookies) {

	// Check if a user has signed in.
	$scope.user = userService.getUser();
	if (!$scope.user) {
		$state.go('login');
		return;
	}

	// new | error | success
	$scope.state = "new";

	// Handle updating avatar
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


	// Handle updating user profile
	$scope.updateUser = function () {

		userService.update($scope.user.id, {

			name: $scope.user.name,
			contact: $scope.user.contact,
			gender: $scope.user.gender,
			workInfo: $scope.user.workInfo,
			avatar: $scope.avatarInput.files[0]

		}).then(res => {

			$scope.state = 'success';

			// Update current user.
			userService.queryUser().then(res => {
				$scope.user = res.data;
				$cookies.put('currentUser', JSON.stringify(res.data));
			})

		}, function (error) {

			$scope.alertMessage = error.data.errors[0];
			$scope.state = "error";

		});
	}

	$scope.cancelUpdateUser = function () {
		$scope.user =  userService.getUser();
	}

	// Handle resetting password
	$scope.email = "";

	$scope.resetPassword = function () {

		authService.requestResetPassword($scope.email).then(res => {
			$scope.state = 'success';
		}, function (error) {
			$scope.alertMessage = error.data.errors[0];
			$scope.state = "error";
		});
	}

	// Handle closing alert
	$scope.closeAlert = function () {
		$scope.state = 'new';
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
