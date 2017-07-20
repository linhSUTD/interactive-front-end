/**
 * Created by nguyenlinh on 7/19/17.
 */
var coursesModule = angular.module('page.courses', []);

coursesModule.config(function($stateProvider, $urlRouterProvider){

	$stateProvider
		.state('courses', {
			url: '/courses',
			controller: 'coursesCtrl',
			templateUrl: '../../partials/courses.html'
		})
})

coursesModule.controller('coursesCtrl', ['$scope', function($scope) {
	$scope.changeLoginState(true);
}]);