/**
 * Created by nguyenlinh on 8/9/17.
 */
var courseModule = angular.module('page.course', ['duScroll']);

courseModule.config(function($stateProvider, $urlRouterProvider){

	$stateProvider
		.state('course', {
			url: '/course/:courseId',
			templateUrl: '../../partials/course/course.html'
		})
		.state('course.introduction', {
			url: '/introduction',
			controller: 'courseIntroductionCtrl',
			templateUrl: '../../partials/course/introduction.html'
		})
		.state('course.home', {
			url: '/welcome',
			controller: 'courseHomePageCtrl',
			templateUrl: '../../partials/course/courseHomePage.html'
		})
})

courseModule.controller('courseIntroductionCtrl', ['$scope', '$stateParams', function($scope, $stateParams) {

}]);

courseModule.controller('courseHomePageCtrl', ['$scope', '$stateParams', function($scope, $stateParams) {

}]);