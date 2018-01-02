var ebookModule = angular.module('page.ebook', ['service.user', 'ui.bootstrap', 'service.auth']);

ebookModule.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('ebook', {
            url: '/ebook',
            controller: 'ebookCtrl',
            templateUrl: '../partials/ebook.html'
        });
})

function ebookPageCtrlFunc($timeout, $q, $scope, $state, $stateParams, userService, authService) {

    $scope.login = function () {

        authService.login($scope.user).then(function () {
            $scope.$emit("user:loggedin");
            document.getElementById('close-modal-button').click();
            $scope.state = 'ordered';

        }).catch(function (error) {
            $scope.alertMessage = error.data.errors[0];
            $scope.state = "error";
        })
    }

    $scope.onOrder = function () {
        if (userService.getUser() == null) {
            document.getElementById('open-modal-button').click();
            return;
        } else {
            $scope.state = 'ordered';
        }
    }

    $scope.number = 1;

    $scope.$watch("number", _ => {
        $scope.state = 'new';
    })

    $scope.register = function () {
        document.getElementById('close-modal-button').click();
        setTimeout(function () {
            $state.go('register');
        }, 200);
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
    function ($timeout, $q, $scope, $state, $stateParams, userService, authService) {

        if ($scope.authReady) {
            ebookPageCtrlFunc($timeout, $q, $scope, $state, $stateParams, userService, authService);
            return;
        }

        $scope.$on("auth:ready", _ => ebookPageCtrlFunc($timeout, $q, $scope, $state, $stateParams, userService, authService));
    }
]);