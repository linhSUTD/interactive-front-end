/**
 * Created by nguyenlinh on 7/16/17.
 */
var authServiceModule = angular.module('service.auth', ['ngCookies']);

authServiceModule.factory('authService', function ($http, $q, settings) {

	return {
		login: function (data) {

			return $http.post(settings.apiUrl + '/login', data);

		},
		register: function (data) {

			return $http.post(settings.apiUrl + '/register', data);

		},
		forgotPassword: function (data) {

			return $http.post(settings.apiUrl + '/forgotPassword', data);
		},
		resetPassword: function (data) {

			return $http.post(settings.apiUrl + '/resetPassword', data);
		}
	}
})
