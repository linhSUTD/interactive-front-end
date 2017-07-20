'use strict';

angular.module('page.firstCourse').factory('ExerciseLoader', ['$log', function ($log) {
    var i = 0;
    var code = [
        "print(\" ex1 \")",
        "print(\" ex2 \")",
        "import numpy as np \n\
import matplotlib.pyplot as plt\n\
\n\
x = np.arange(0, 5, 0.1);\n\
y = np.sin(x)\n\
plt.plot(x, y)\n\
plt.show()"
    ];

    function getExercise() {
        return {
            pre_exercise_code: code[(++i % code.length)],
            sample: "",
            solution: "",
            sct: "",
            hint: "hint",
            language: "python"
        };
    }

    return {
        getExercise: getExercise
    };
}]);
