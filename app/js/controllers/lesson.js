/**
 * Created by nguyenlinh on 8/10/17.
 */
var lessonModule = angular.module('page.lesson', []);

lessonModule.config(function($stateProvider, $urlRouterProvider){

	$stateProvider
		.state('course.lesson', {
			url: '/lesson/:lessonId',
			templateUrl: '../../partials/lesson/lesson.html'
		})
})

lessonModule.controller('lessonCtrl', ['$scope', function($scope) {
}]);

lessonModule.controller('exerciseCtrl', ['$scope', function($scope) {

}]);