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
		getCurrentUser: function () {
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
				if (res.status >= 400) {
					logout();
					cb(false);
					return;
				}

				currentUser = res.data;
				cb(true);
			});
		},
		login: function (data) {
			var promise = $http.post(settings.apiUrl + '/account/sign-in', convertToFormData(data));
			promise.then(r => {
				if (r.status >= 400) {
					console.warn("login failed");
					return;
				}
				$http.defaults.headers.common['Authorization'] = "Bearer " + r.data.accessToken;
				$http.get(settings.apiUrl + '/account/me').then(r2 => currentUser = r2.data);
			});
			return promise;
		},
		register: function (data) {
			var promise = $http.post(settings.apiUrl + '/account', convertToFormData(data));
			promise.then(r => {
				console.log(r);
				$http.defaults.headers.common['Authorization'] = "Bearer" + r.data.accessToken;
			});
			return promise;
		},
		forgotPassword: function (data) {
			return $http.post(settings.apiUrl + '/forgotPassword', data);
		},
		resetPassword: function (data) {
			return $http.post(settings.apiUrl + '/resetPassword', data);
		}
	}
});
