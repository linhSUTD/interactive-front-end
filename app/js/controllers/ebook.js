var ebookModule = angular.module('page.ebook', ['service.user', 'ui.bootstrap', 'service.auth', 'service.ebook']);

ebookModule.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('ebook', {
            url: '/ebook',
            controller: 'ebookCtrl',
            templateUrl: '../partials/ebook.html'
        });
})

function ebookPageCtrlFunc($timeout, $q, $scope, $state, $stateParams, userService, authService, ebookService) {

    // Load reviews
    function loadReviews() {
        ebookService.reviews($stateParams.courseId, null, null, 5, "descending").then(res => {
            $scope.reviews = res.data;
        });

        ebookService.rating($stateParams.courseId).then(res => {
            var ratingData = res.data;
            $scope.rating = (ratingData && ratingData.count) ?
                Number(ratingData.sum * 1.0 / ratingData.count).toFixed(1) + '/5' : '';
        });
    }

    $scope.state = 'new';

    $scope.user = userService.getUser();

    $scope.login = function () {

        authService.login($scope.user).then(function () {
            $scope.$emit("user:loggedin");
            document.getElementById('close-login-modal-button').click();
            $scope.state = 'ordered';

        }).then(_ => {
            // Handle updating user profile
            $scope.user = userService.getUser();

            $scope.updateUser = function () {

                userService.update($scope.user.id, {

                    orderStatus: 'ordered'

                }).then(res => {

                    // Update current user.
                    userService.queryUser().then(res => {
                        $scope.user = res.data;
                        $cookies.put('currentUser', JSON.stringify(res.data));
                    })

                }).catch(error => {

                    $scope.alertMessage = error.data.errors[0];
                    $scope.state = "error";

                });
            }

        }).catch(function (error) {
            $scope.alertMessage = error.data.errors[0];
            $scope.state = "error";
        })
    }

    $scope.onOrder = function () {
        if ($scope.user == null) {
            document.getElementById('open-login-modal-button').click();
            return;
        } else {
            $scope.state = 'ordered';
        }
    }

    $scope.register = function () {
        document.getElementById('close-login-modal-button').click();
        setTimeout(function () {
            $state.go('register');
        }, 200);
    }

    loadReviews();
}

ebookModule.controller('ebookCtrl', [
    '$timeout',
    '$q',
    '$scope',
    '$state',
    '$stateParams',
    'userService',
    'authService',
    'ebookService',
    function ($timeout, $q, $scope, $state, $stateParams, userService, authService, ebookService) {

        if ($scope.authReady) {
            ebookPageCtrlFunc($timeout, $q, $scope, $state, $stateParams, userService, authService, ebookService);
            return;
        }

        $scope.$on("auth:ready", _ => ebookPageCtrlFunc($timeout, $q, $scope, $state, $stateParams, userService, authService, ebookService));
    }
]);