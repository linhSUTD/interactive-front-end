var homeModule = angular.module('page.home', ['service.course']);

homeModule.config(function ($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise('/home');

	$stateProvider
		.state('home', {
			url: '/home',
			controller: 'homeCtrl',
			templateUrl: '../partials/home.html'
		});
})

homeModule.controller('homeCtrl', ['$scope', '$http', 'courseService', function ($scope, $http, courseService) {

	courseService.getRecentCourses(null, null, 10, "descending").then(function (response) {
		if (response.status >= 400) {
			return;
		}

		$scope.recentCourses = response.data;

		setTimeout(function () {
			$('.owl-carousel').trigger('refresh.owl.carousel');
		}, 1000);
	});
}]);
