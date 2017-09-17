var config = angular.module('config', []);

config.constant('settings', {
	apiUrl: 'http://fundaml.com/api',
	activationUrl: '/activation.html',
	resetPasswordUrl: '/resetPassword.html',
	userRole: {
		PUBLIC: "Public",
		ADMIN: "Admin"
	},
	pageUrl: {
		HOME: '/home',
		LOGIN: '/login',
		REGISTRATION: '/registration',
		FORGOT_PASSWORD: '/forgotPassword',
		DASH_BOARD: '/dashboard',
		ADMIN: 'http://localhost:8080/'
	}
});
