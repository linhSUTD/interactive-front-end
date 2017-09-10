var authServiceModule = angular.module('service.auth', ['ngCookies']);

authServiceModule.factory('authService', function ($http, $cookies, $q, settings) {

	function logout() {
		$cookies.put('currentUser', undefined);
		$cookies.put('token', undefined);
		$http.defaults.headers.common['Authorization'] = undefined;
	}

	return {
		logout: function () {
			logout();
		},
		refresh: function () {
			return $http.get(settings.apiUrl + '/account/me').then(res => {
				$cookies.put('currentUser', JSON.stringify(res.data));
			});
		},
		getCurrentUser: function () {
			if ($cookies.get('currentUser') == "" || $cookies.get('currentUser') == undefined || $cookies.get('currentUser') == null) {
				return null;
			}

			var currentUser = JSON.parse($cookies.get('currentUser'));

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

				$cookies.put('currentUser', JSON.stringify(res.data));
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

				$cookies.put('currentUser', JSON.stringify(r2.data));
				defer.resolve();

			}, _ => defer.reject(_));

			return defer.promise;
		},
		register: function (data) {
			var promise = $http.post(settings.apiUrl + '/account', convertToFormData(data));
			return promise;
		},
		requestResetPassword: function (email) {
			return $http.post(`${settings.apiUrl}/account/password`, convertToFormData({
				email: email,
				url: settings.resetPasswordUrl
			}));
		},
		resetPassword: function (code, newPassword) {
			return $http.put(`${settings.apiUrl}/account/password`, convertToFormData({
				code: code,
				newPassword: newPassword
			}));
		},
		activateAccount: function (data) {
			return $http.post(`${settings.apiUrl}/account/activate`, convertToFormData(data));
		}
	}
});
