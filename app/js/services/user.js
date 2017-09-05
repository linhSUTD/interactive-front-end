var userServiceModule = angular.module('service.user', ['ngCookies', 'service.auth']);

userServiceModule.factory('userService', function ($http, $q, settings, $cookies, authService) {

	return {
		getUser: function () {
			return authService.getCurrentUser();
		},
		author: function (id) {
			return $http.get(settings.apiUrl + "/user/" + id + "/author");
		},
		update: function (id, model) {
			return $http.put(settings.apiUrl + "/account/" + id, convertToFormData(model));
		}
	}
});
