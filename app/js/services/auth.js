var authServiceModule = angular.module('service.auth', ['ngCookies']);

authServiceModule.factory('authService', function ($http, $cookies, $q, settings) {
	var currentUser = null;

	function logout() {
		$cookies.put('token', undefined);
		$http.defaults.headers.common['Authorization'] = undefined;
	}

	return {
		logout: function () {
			logout();
		},
		refresh: function () {
			return $http.get(settings.apiUrl + '/account/me').then(res => {
				currentUser = res.data;
			});
		},
		getCurrentUser: function () {
			if (!currentUser) {
				return null;
			}

			if (!currentUser.avatarUrl) {
				currentUser.avatarUrl = "https://tailuns.com/avatar/no.png";
			}
			return currentUser;
		},
		tryPreviousSession: function (cb) {
			var token = $cookies.get('token');
			if (!token) {
				cb(false);
				return;
			}

			$http.defaults.headers.common['Authorization'] = "Bearer " + token;

			$http.get(settings.apiUrl + '/account/me').then(res => {
				currentUser = res.data;
				cb(true);
			}, rej => {
				logout();
				cb(false);
				return;
			});
		},
		login: function (data) {
			var defer = $q.defer();
			var promise = $http.post(settings.apiUrl + '/account/sign-in', convertToFormData(data));
			promise.then(r => {
				$cookies.put('token', r.data.accessToken);
				$http.defaults.headers.common['Authorization'] = "Bearer " + r.data.accessToken;
				return $http.get(settings.apiUrl + '/account/me');
			}, err => defer.reject(err)).then(r2 => {
				currentUser = r2.data;
				defer.resolve();
			}, _ => defer.reject(_));

			return defer.promise;
		},
		register: function (data) {
			var defer = $q.defer();
			var promise = $http.post(settings.apiUrl + '/account', convertToFormData(data));
			promise.then(r => {
				$cookies.put('token', r.data.accessToken);
				$http.defaults.headers.common['Authorization'] = "Bearer " + r.data.accessToken;
				return $http.get(settings.apiUrl + '/account/me');
			}, _ => defer.reject()).then(r2 => {
				currentUser = r2.data;
				defer.resolve();
			}, _ => defer.reject());

			return defer.promise;
		},
		forgotPassword: function (data) {
			return $http.post(settings.apiUrl + '/forgotPassword', data);
		},
		resetPassword: function (data) {
			return $http.post(settings.apiUrl + '/resetPassword', data);
		}
	}
});
