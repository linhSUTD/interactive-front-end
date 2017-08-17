var academicModule = angular.module('service.academic', []);

academicModule.factory('courseService', function ($http, $q, settings) {
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
        }
    }
});
