var homeModule = angular.module('page.home', []);

homeModule.config(function($stateProvider, $urlRouterProvider){

	$urlRouterProvider.otherwise('/home');

	$stateProvider
		.state('home', {
			url: '/home',
			controller: 'homeCtrl',
			templateUrl: '../partials/home.html'
		})
})

homeModule.controller('homeCtrl', ['$scope', '$http', function ($scope, $http) {

}]);
