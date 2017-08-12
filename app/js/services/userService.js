/**
 * Created by nguyenlinh on 7/16/17.
 */
var userServiceModule = angular.module('service.user', ['ngCookies']);

userServiceModule.factory('userService', function ($http, $q, settings, $cookies) {

	return {
		getUser: function () {

			return $http.get(settings.apiUrl + '/account/me' + '?Authorization=' + $cookies.get('token'));

		}
	}
})
