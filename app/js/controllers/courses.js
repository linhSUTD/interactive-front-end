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

const headerStateMap = {
	"recommended": "Khoá Học Hot",
	"searching": "Xin đợi",
	"searched": "Kết quả tìm kiếm",
	"searchFailed": "Đã có lỗi xảy ra, hãy thử tìm kiếm lại"
};

coursesModule.controller('coursesCtrl', ['$scope', '$course', '$state', function ($scope, $course, $state) {

	$scope.header = function () {
		return headerStateMap[$scope.state];
	}

	// recommended | searching | searched | searchFailed
	$scope.state = "recommended";

	// Load all recommended courses
	$course.recentCourses(null, null, 50, "descending").then(function (response) {
		if (response.status >= 400) {
			return;
		}

		$scope.recommendations = response.data;
	});

	// Handle searching courses
	$scope.query = "";

	$scope.onSearch = function () {
		$scope.state = "searching";

		$course.search($scope.query, null, null, null, null, 10).then(res => {
			$scope.searchResults = res.data;
			$scope.state = "searched";
		}, err => {
			$scope.state = "searchFailed";
		});
	}
}]);
