var activation = angular.module('activationApp', ['ngCookies', 'service.auth', 'config', 'ui.router', 'ui.bootstrap']);

activation.config(['$httpProvider', function ($httpProvider) {
	$httpProvider.defaults.headers.post = {
		'Content-Type': undefined
	};
}]);

activation.controller('activationCtrl', ['$scope', 'authService', 'settings', '$state', '$stateParams', '$http', '$cookies',
	function ($scope, authService, settings, $state, $stateParams, $http, $cookies) {

	var data = {
		code: window.location.search.substring(1).split("=")[1]
	}

	$scope.hasAlert = false;

	authService.activateAccount(data).then(function(response) {

		$cookies.put('token', response.data.accessToken);
		$http.defaults.headers.common['Authorization'] = "Bearer " + response.data.accessToken;
		window.location = `${settings.webUrl}/home`;

	}, function(error) {

		$scope.alert = {
			type: 'danger',
			msg: error.data.message
		}
		$scope.hasAlert = true;

	})

	$scope.closeAlert = function() {
		$scope.hasAlert = false;
		$scope.alert = {};
	};

}]);
