var academicModule = angular.module('service.academic', []);

academicModule.factory('$datacamp', function () {
    return new DataCampService();
});

academicModule.factory('$course', function ($http, $q, settings) {
    return {
        count: function (activeOnly = true) {
            return $http.get(`${settings.apiUrl}/course/count`, {
                params: {
                    activeOnly: activeOnly
                }
            });
        },

        recentCourses: function (before, after, limit, sort) {
            return $http.get(settings.apiUrl + '/course', {
                params: {
                    before: before,
                    after: after,
                    limit: limit,
                    sort: sort
                }
            });
        },

        get: function (id) {
            return $http.get(settings.apiUrl + '/course/' + id);
        },

        lessons: function (id) {
            return $http.get(settings.apiUrl + "/course/" + id + "/lessons");
        },

        reviews: function (id) {
            return $http.get(settings.apiUrl + "/course/" + id + "/reviews");
        },

        postReview: function (id, title, detail, score) {
            return $http.post(`${settings.apiUrl}/course/${id}/review`, convertToFormData({
                title: title,
                detail: detail || "",
                score: score
            }));
        },

        subscription: function (userId, courseId) {
            return $http.get(settings.apiUrl + "/user/" + userId + "/course/" + courseId);
        },

        subscriptions: function (userId, before, after, limit, sort) {
            return $http.get(`${settings.apiUrl}/user/${userId}/courses`, {
                params: {
                    before: before,
                    after: after,
                    limit: limit,
                    sort: sort
                }
            });
        },

        register: function (userId, courseId) {
            return $http.post(settings.apiUrl + "/user/" + userId + "/register", convertToFormData({
                courseId: courseId
            }));
        },

        progress: function (userId, courseId) {
            return $http.get(`${settings.apiUrl}/course/${courseId}/progress`, {
                params: {
                    userId: userId
                }
            });
        },

        search: function (query, categories, levels, before, after, limit) {
            return $http.get(`${settings.apiUrl}/course/search`, {
                params: {
                    query: query,
                    categories: categories,
                    levels: levels,
                    before: before,
                    after: after,
                    limit: limit
                }
            });
        }
    }
});

academicModule.factory('$lesson', function ($http, $q, settings) {
    function getLesson(id) {
        return $http.get(`${settings.apiUrl}/lesson/${id}`);
    }

    function getExercises(id) {
        return $http.get(`${settings.apiUrl}/lesson/${id}/exercises`);
    }

    function getProgress(id, userId) {
        return $http.get(`${settings.apiUrl}/lesson/${id}/progress`, {
            params: {
                userId: userId
            }
        });
    }

    return {
        count: function (activeOnly = true) {
            return $http.get(`${settings.apiUrl}/lesson/count`, {
                params: {
                    activeOnly: activeOnly
                }
            });
        },

        get: getLesson,

        exercises: getExercises,

        progress: getProgress,

        outline: function (id, userId) {
            var defer = $q.defer();
            var lesson = null;
            var exerciseSummaries = null;
            var progress = null;

            var lessonPromise = getLesson(id).then(res => {
                if (!res.data) { return; }
                lesson = res.data;
            });

            var exercisePromise = getExercises(id).then(res => {
                exerciseSummaries = res.data;
            });

            var progressPromise = getProgress(id, userId).then(res => {
                progress = res.data || {};
            });

            $q.all([lessonPromise, exercisePromise, progressPromise]).then(_ => {
                var outline = [{
                    type: "lesson",
                    data: lesson
                }];

                outline = outline.concat(exerciseSummaries.map(es => {
                    es.completed = !!progress[es.id];
                    return {
                        type: "exercise",
                        data: es
                    };
                }));

                defer.resolve(outline);
            });

            return defer.promise;
        }
    };
});

academicModule.factory('$exercise', function ($http, $q, settings) {
    return {
        count: function (activeOnly = true) {
            return $http.get(`${settings.apiUrl}/exercise/count`, {
                params: {
                    activeOnly: activeOnly
                }
            });
        },

        get: function (id) {
            return $http.get(`${settings.apiUrl}/exercise/${id}`);
        },

        progress: function (id, userId) {
            return $http.get(`${settings.apiUrl}/user/${userId}/exercise-progress`, {
                params: {
                    exerciseId: id
                }
            });
        },

        saveProgress: function (id, userId, content, output) {
            return $http.post(`${settings.apiUrl}/user/${userId}/exercise-progress`, convertToFormData({
                exerciseId: id,
                content: content,
                output: output
            }));
        }
    };
});
