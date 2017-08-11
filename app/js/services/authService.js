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
			var form_data = new FormData();

			for ( var key in data ) {
				console.log(key);
				console.log(data[key]);
				form_data.append(key, data[key]);
			}

			console.log("dmdmd");
			console.log(form_data);

			return $http.post(settings.apiUrl + '/account', form_data, {headers: {
				'Content-Type': undefined
			}});

		},
		forgotPassword: function (data) {

			return $http.post(settings.apiUrl + '/forgotPassword', data);
		},
		resetPassword: function (data) {

			return $http.post(settings.apiUrl + '/resetPassword', data);
		},
		getCourses: function() {
			return $http.get(settings.apiUrl + '/course');
		}
	}
})
