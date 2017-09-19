var config = angular.module('config', []);

config.constant('settings', {
	html5mode: true,
	apiUrl: '/api',
	activationUrl: '/activation',
	resetPasswordUrl: '/resetPassword',
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
		ADMIN: '/admin'
	}
});
