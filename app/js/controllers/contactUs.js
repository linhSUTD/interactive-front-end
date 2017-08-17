/**
 * Created by nguyenlinh on 8/16/17.
 */
var contactModule = angular.module('page.contactUs', []);

contactModule.config(function ($stateProvider, $urlRouterProvider) {

	$stateProvider
		.state('contactus', {
			url: '/contact',
			controller: 'contactCtrl',
			templateUrl: '../partials/contactus.html'
		});
})

contactModule.controller('contactCtrl', ['$scope', '$http', function ($scope, $http) {

}]);
