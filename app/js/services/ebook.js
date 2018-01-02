var ebookModule = angular.module('service.ebook', []);

ebookModule.factory('ebookService', function ($http, $q, settings) {
    return {
        reviews: function (id, before, after, limit, sort) {
            return $http.get(settings.apiUrl + "/book/" + id + "/reviews", {
                params: {
                    before: before,
                    after: after,
                    limit: limit,
                    sort: sort
                }
            });
        },

        rating: function (id) {
            return $http.get(settings.apiUrl + "/book/" + id + "/rating");
        },

        postReview: function (id, title, detail, score) {
            return $http.post(`${settings.apiUrl}/book/${id}/review`, convertToFormData({
                title: title,
                detail: detail || "",
                score: score
            }));
        },
    }
});