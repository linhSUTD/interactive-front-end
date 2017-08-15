var lessonModule = angular.module('page.lesson', []);

lessonModule.config(function ($stateProvider, $urlRouterProvider) {

	$stateProvider
		.state('course.lesson', {
			url: '/lesson/:lessonId',
			templateUrl: '../../partials/lesson/lesson.html'
		})
		.state('course.lesson.exercise', {
			url: '/exercise/:exerciseId',
			controller: 'exerciseCtrl',
			templateUrl: '../../partials/lesson/exercise.html'
		})
})

lessonModule.controller('lessonCtrl', ['$scope', function ($scope) {
}]);

lessonModule.controller('exerciseCtrl', ['$scope', function ($scope) {

}]);
