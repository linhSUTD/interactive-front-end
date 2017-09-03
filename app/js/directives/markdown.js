var directiveModule = angular.module('directives', []);

directiveModule.directive("markdown", function () {
    var converter = new Showdown.converter();
    return {
        restrict: "E",
        scope: {
            //@ reads the attribute value, = provides two-way binding, & works with functions
            //title: '@'
        },
        template: "",
        //controller: controllerFunction, //Embed a custom controller in the directive
        link: function ($scope, $element, $attrs) {
            //DOM manipulation
            $attrs.$observe("ngDataSrc", function (newValue) {
                $element.html(converter.makeHtml($attrs.ngDataSrc || ""));
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, $element[0]]);
            });

            $element.html(converter.makeHtml($attrs.ngDataSrc || ""));
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, $element[0]]);
        }
    };
});
