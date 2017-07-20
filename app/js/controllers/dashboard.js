/**
 * Created by nguyenlinh on 7/18/17.
 */

var dashboardModule = angular.module('page.dashboard', ['ngCookies']);

dashboardModule.config(function($stateProvider, $urlRouterProvider){

	$stateProvider
		.state('dashboard', {
			url: '/dashboard',
			controller: 'dashboardCtrl',
			templateUrl: '../../partials/dashboard.html'
		})
})

dashboardModule.run(function($cookies, $state) {
	if (!$cookies.get('token')) {
		window.location = settings.webUrl + settings.pageUrl.HOME;
	}
})

dashboardModule.controller('dashboardCtrl', ['$scope', function($scope) {
	$scope.changeLoginState(true);
}]);