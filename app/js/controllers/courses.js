/**
 * Created by nguyenlinh on 9/2/17.
 */
var coursesModule = angular.module('page.courses', []);

coursesModule.config(function ($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise('/courses');

	$stateProvider
		.state('courses', {
			url: '/courses',
			controller: 'coursesCtrl',
			templateUrl: '../partials/courses.html'
		});
})

coursesModule.controller('coursesCtrl', ['$scope', '$course', 'userService', '$state', function ($scope, $course, userService, $state) {

}]);