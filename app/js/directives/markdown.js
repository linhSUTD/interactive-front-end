var directiveModule = angular.module('directives', []);

directiveModule.directive("markdown", function ($timeout) {
    var converter = new Showdown.converter();
    function scheduleRendering(ele) {
        $timeout(function () {
            var items = ele[0].querySelectorAll('pre');
            angular.forEach(items, function (item) {
                hljs.highlightBlock(item);
            });

            MathJax.Hub.Queue(["Typeset", MathJax.Hub, ele[0]]);
        }, 0);
    }

    return {
        restrict: "EA",
        replace: false,
        scope: {
            //@ reads the attribute value, = provides two-way binding, & works with functions
            //title: '@'
        },
        template: "",
        //controller: controllerFunction, //Embed a custom controller in the directive
        link: function ($scope, $element, $attrs) {
            //DOM manipulation
            $attrs.$observe("ngDataSrc", function (newValue) {
                var html = converter.makeHtml($attrs.ngDataSrc || "");
                $element.html(html);
                if (!!html) {
                    scheduleRendering($element);
                }
            });

            var html = converter.makeHtml($attrs.ngDataSrc || "");
            $element.html(html);
            if (!!html) {
                scheduleRendering($element);
            }
        }
    };
});
