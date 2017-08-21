var homeModule = angular.module('page.home', ['service.academic']);

homeModule.config(function ($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise('/home');

	$stateProvider
		.state('home', {
			url: '/home',
			controller: 'homeCtrl',
			templateUrl: '../partials/home.html'
		});
})

homeModule.controller('homeCtrl', ['$scope', '$http', '$course', function ($scope, $http, $course) {

	$course.recentCourses(null, null, 10, "descending").then(function (response) {
		if (response.status >= 400) {
			return;
		}

		$scope.recentCourses = response.data;

		setTimeout(function () {
			$('.owl-carousel').trigger('refresh.owl.carousel');
		}, 1000);
	});
}]);
