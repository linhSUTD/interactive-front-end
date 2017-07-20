/**
 * Created by nguyenlinh on 7/19/17.
 */
var config = angular.module('config', []);

config.constant('settings', {
	apiUrl: 'http://localhost:5001/api',
	webUrl: 'http://localhost:3002/#!',
	userRole: {
		PUBLIC: "Public",
		ADMIN: "Admin"
	},
	pageUrl: {
		HOME:           	'/home',
		LOGIN:              '/login',
		REGISTRATION: 		'/registration',
		FORGOT_PASSWORD: 	'/forgotPassword',
		DASH_BOARD:			'/dashboard'
	}
});