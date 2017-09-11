var config = angular.module('config', []);

config.constant('settings', {
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
		DASH_BOARD: '/dashboard'
	}
});
