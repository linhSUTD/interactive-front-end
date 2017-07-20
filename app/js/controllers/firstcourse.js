/**
 * Created by nguyenlinh on 7/19/17.
 */
var firstCourseModule = angular.module('page.firstCourse', ['ngCookies']);

firstCourseModule.config(function($stateProvider, $urlRouterProvider){

	$stateProvider
		.state('firstcourse', {
			url: '/firstcourse',
			controller: 'firstCourseCtrl',
			templateUrl: '../../partials/firstcourse.html'
		})
		.state('firstcourse.introduction', {
			url: '/introduction',
			controller: 'firstCourse.Introduction.Ctrl',
			templateUrl: '../../partials/firstcourse/introduction.html'
		})
		.state('firstcourse.content', {
			url: '/content',
			controller: 'firstCourse.Content.Ctrl',
			templateUrl: '../../partials/firstcourse/content.html'
		})
})

firstCourseModule.run(function($cookies, $state, settings) {
	if (!$cookies.get('token')) {
		window.location = settings.webUrl + settings.pageUrl.HOME;
	}
})

firstCourseModule.controller('firstCourseCtrl', ['$scope', function($scope) {
	$scope.changeLoginState(true);
}]);

firstCourseModule.controller('firstCourse.Introduction.Ctrl', ['$scope', '$state', function($scope, $state) {

	$scope.registerCourse = function() {
		// Call to server

		// Redirect to content page
		$state.go('firstcourse.content');
	}
}]);

firstCourseModule.controller('firstCourse.Content.Ctrl', ['$scope', '$state', function($scope, $state) {
}]);

