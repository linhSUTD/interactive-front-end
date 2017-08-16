var userServiceModule = angular.module('service.user', ['ngCookies', 'service.auth']);

userServiceModule.factory('userService', function ($http, $q, settings, $cookies, authService) {

	return {
		getUser: function () {
			return authService.getCurrentUser();
		},
		getAuthor: function (id) {
			return $http.get(settings.apiUrl + "/user/" + id + "/author");
		}
	}
});
