var ebookModule = angular.module('page.ebook', ['service.user', 'ui.bootstrap', 'service.auth', 'service.ebook']);

ebookModule.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('ebook', {
            url: '/ebook',
            controller: 'ebookCtrl',
            templateUrl: '../partials/ebook.html'
        });
})

function ebookPageCtrlFunc($timeout, $q, $scope, $state, $stateParams, userService, authService, $ebook) {
    // Load reviews
    function loadReviews(id) {
        $ebook.reviews(id, null, null, 5, "descending").then(res => {
            $scope.reviews = res.data;
        });

        $ebook.rating(id).then(res => {
            var ratingData = res.data;
            console.log(ratingData);
            $scope.rating = (ratingData && ratingData.count) ?
                Number(ratingData.sum * 1.0 / ratingData.count).toFixed(1) + '/5' : '';
        });
    }

    function loadOrder(id) {
        if (!$scope.currentUser) {
            return;
        }
        $ebook.order($scope.ebook.id).then(r => {
            $scope.order = r.data;
        });
    }

    function download() {
        $ebook.downloadToken($scope.ebook.id).then(r => {
            $("#download-link").attr("href", $ebook.downloadLink($scope.ebook.id, r.data));
            document.getElementById("download-link").click();
        });
    }

    $scope.ebook = {};
    $scope.currentUser = userService.getUser();
    // $scope.currentUser = null;

    $scope.onOrder = function () {
        $ebook.placeOrder($scope.ebook.id).then(r => {
            loadOrder();
        });
    }

    $scope.review_onSubmit = function () {
        $ebook.postReview($scope.ebook.id, $scope.reviewTitle, $scope.review, $scope.reviewScore).then(r => {
            loadReviews($scope.ebook.id);
        });
    }

    $ebook.get().then(d => {
        $scope.ebook = d.data[0];
        loadReviews($scope.ebook.id);
        loadOrder();
    });

    $scope.onDownload = function () {
        download();
    }
}

ebookModule.controller('ebookCtrl', [
    '$timeout',
    '$q',
    '$scope',
    '$state',
    '$stateParams',
    'userService',
    'authService',
    '$ebook',
    function ($timeout, $q, $scope, $state, $stateParams, userService, authService, $ebook) {

        if ($scope.authReady) {
            ebookPageCtrlFunc($timeout, $q, $scope, $state, $stateParams, userService, authService, $ebook);
            return;
        }

        $scope.$on("auth:ready", _ => ebookPageCtrlFunc($timeout, $q, $scope, $state, $stateParams, userService, authService, $ebook));
    }
]);
