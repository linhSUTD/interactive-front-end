var academicModule = angular.module('service.academic', []);

academicModule.factory('$datacamp', function () {
    return new DataCampService();
});

academicModule.factory('$course', function ($http, $q, settings) {
    return {
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

        registration: function (userId, courseId) {
            return $http.get(settings.apiUrl + "/user/" + userId + "/course/" + courseId);
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
    return {
        get: function (id) {
            return $http.get(`${settings.apiUrl}/lesson/${id}`);
        },

        exercises: function (id) {
            return $http.get(`${settings.apiUrl}/lesson/${id}/exercises`);
        },

        progress: function (userId, id) {
            return $http.get(`${settings.apiUrl}/lesson/${id}/progress`, {
                params: {
                    userId: userId
                }
            });
        }
    };
});

academicModule.factory('$exercise', function ($http, $q, settings) {
    return {
        get: function (id) {
            return $http.get(`${settings.apiUrl}/exercise/${id}`);
        }
    };
});
