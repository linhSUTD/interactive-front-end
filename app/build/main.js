(function(b){b.gritter={};b.gritter.options={position:"",class_name:"",fade_in_speed:"medium",fade_out_speed:1000,time:6000};b.gritter.add=function(f){try{return a.add(f||{})}catch(d){var c="Gritter Error: "+d;(typeof(console)!="undefined"&&console.error)?console.error(c,f):alert(c)}};b.gritter.remove=function(d,c){a.removeSpecific(d,c||{})};b.gritter.removeAll=function(c){a.stop(c||{})};var a={position:"",fade_in_speed:"",fade_out_speed:"",time:"",_custom_timer:0,_item_count:0,_is_setup:0,_tpl_close:'<div class="gritter-close"></div>',_tpl_title:'<span class="gritter-title">[[title]]</span>',_tpl_item:'<div id="gritter-item-[[number]]" class="gritter-item-wrapper [[item_class]]" style="display:none"><div class="gritter-top"></div><div class="gritter-item">[[close]][[image]]<div class="[[class_name]]">[[title]]<p>[[text]]</p></div><div style="clear:both"></div></div><div class="gritter-bottom"></div></div>',_tpl_wrap:'<div id="gritter-notice-wrapper"></div>',add:function(g){if(typeof(g)=="string"){g={text:g}}if(!g.text){throw'You must supply "text" parameter.'}if(!this._is_setup){this._runSetup()}var k=g.title,n=g.text,e=g.image||"",l=g.sticky||false,m=g.class_name||b.gritter.options.class_name,j=b.gritter.options.position,d=g.time||"";this._verifyWrapper();this._item_count++;var f=this._item_count,i=this._tpl_item;b(["before_open","after_open","before_close","after_close"]).each(function(p,q){a["_"+q+"_"+f]=(b.isFunction(g[q]))?g[q]:function(){}});this._custom_timer=0;if(d){this._custom_timer=d}var c=(e!="")?'<img src="'+e+'" class="gritter-image" />':"",h=(e!="")?"gritter-with-image":"gritter-without-image";if(k){k=this._str_replace("[[title]]",k,this._tpl_title)}else{k=""}i=this._str_replace(["[[title]]","[[text]]","[[close]]","[[image]]","[[number]]","[[class_name]]","[[item_class]]"],[k,n,this._tpl_close,c,this._item_count,h,m],i);if(this["_before_open_"+f]()===false){return false}b("#gritter-notice-wrapper").addClass(j).append(i);var o=b("#gritter-item-"+this._item_count);o.fadeIn(this.fade_in_speed,function(){a["_after_open_"+f](b(this))});if(!l){this._setFadeTimer(o,f)}b(o).bind("mouseenter mouseleave",function(p){if(p.type=="mouseenter"){if(!l){a._restoreItemIfFading(b(this),f)}}else{if(!l){a._setFadeTimer(b(this),f)}}a._hoverState(b(this),p.type)});b(o).find(".gritter-close").click(function(){a.removeSpecific(f,{},null,true)});return f},_countRemoveWrapper:function(c,d,f){d.remove();this["_after_close_"+c](d,f);if(b(".gritter-item-wrapper").length==0){b("#gritter-notice-wrapper").remove()}},_fade:function(g,d,j,f){var j=j||{},i=(typeof(j.fade)!="undefined")?j.fade:true,c=j.speed||this.fade_out_speed,h=f;this["_before_close_"+d](g,h);if(f){g.unbind("mouseenter mouseleave")}if(i){g.animate({opacity:0},c,function(){g.animate({height:0},300,function(){a._countRemoveWrapper(d,g,h)})})}else{this._countRemoveWrapper(d,g)}},_hoverState:function(d,c){if(c=="mouseenter"){d.addClass("hover");d.find(".gritter-close").show()}else{d.removeClass("hover");d.find(".gritter-close").hide()}},removeSpecific:function(c,g,f,d){if(!f){var f=b("#gritter-item-"+c)}this._fade(f,c,g||{},d)},_restoreItemIfFading:function(d,c){clearTimeout(this["_int_id_"+c]);d.stop().css({opacity:"",height:""})},_runSetup:function(){for(opt in b.gritter.options){this[opt]=b.gritter.options[opt]}this._is_setup=1},_setFadeTimer:function(f,d){var c=(this._custom_timer)?this._custom_timer:this.time;this["_int_id_"+d]=setTimeout(function(){a._fade(f,d)},c)},stop:function(e){var c=(b.isFunction(e.before_close))?e.before_close:function(){};var f=(b.isFunction(e.after_close))?e.after_close:function(){};var d=b("#gritter-notice-wrapper");c(d);d.fadeOut(function(){b(this).remove();f()})},_str_replace:function(v,e,o,n){var k=0,h=0,t="",m="",g=0,q=0,l=[].concat(v),c=[].concat(e),u=o,d=c instanceof Array,p=u instanceof Array;u=[].concat(u);if(n){this.window[n]=0}for(k=0,g=u.length;k<g;k++){if(u[k]===""){continue}for(h=0,q=l.length;h<q;h++){t=u[k]+"";m=d?(c[h]!==undefined?c[h]:""):c[0];u[k]=(t).split(l[h]).join(m);if(n&&u[k]!==t){this.window[n]+=(t.length-u[k].length)/l[h].length}}}return p?u:u[0]},_verifyWrapper:function(){if(b("#gritter-notice-wrapper").length==0){b("body").append(this._tpl_wrap)}}}})(jQuery);
/**
 * Created by nguyenlinh on 7/16/17.
 */
function showPopUp(title, text, time) {
	$.gritter.add({
		title: title,
		text: text || " ",
		time: time || 2000
	});
}
/**
 * Created by nguyenlinh on 7/19/17.
 */
var config = angular.module('config', []);

config.constant('settings', {
	apiUrl: 'http://localhost:5001/api',
	webUrl: 'http://localhost:3002/#!',
	userRole: {
		PUBLIC: "Public",
		ADMIN: "Admin"
	},
	pageUrl: {
		HOME:           	'/home',
		LOGIN:              '/login',
		REGISTRATION: 		'/registration',
		FORGOT_PASSWORD: 	'/forgotPassword',
		DASH_BOARD:			'/dashboard'
	}
});
'use strict';

var app = angular.module('mainApp', [
	'config',
	'ui.router',
	'page.home',
	'page.login',
	'page.registration',
	'page.forgotPassword',
	'page.resetPassword',
	'page.dashboard',
	'page.courses',
	'page.firstCourse',
	'service.auth',
	'ngCookies'
]);

app.run(function($cookies, $state, settings) {
	if ($cookies.get('token')) {
		window.location = settings.webUrl + settings.pageUrl.DASH_BOARD;
	}
})

app.controller('baseCtrl', ['$scope', '$cookies', 'settings', function($scope, $cookies, settings) {

	$scope.isLoggedIn = false;

	if ($cookies.get('token')) {
		$scope.isLoggedIn = true;
	}

	$scope.logout = function() {
		$cookies.put('token', undefined);
		$scope.isLoggedIn = false;
		window.location = settings.webUrl + settings.pageUrl.HOME;
	}

	$scope.changeLoginState = function(val) {
		$scope.isLoggedIn = val;
	}
}]);

/**
 * Created by nguyenlinh on 7/19/17.
 */
var coursesModule = angular.module('page.courses', []);

coursesModule.config(function($stateProvider, $urlRouterProvider){

	$stateProvider
		.state('courses', {
			url: '/courses',
			controller: 'coursesCtrl',
			templateUrl: '../../partials/courses.html'
		})
})

coursesModule.controller('coursesCtrl', ['$scope', function($scope) {
	$scope.changeLoginState(true);
}]);
/**
 * Created by nguyenlinh on 7/18/17.
 */

var dashboardModule = angular.module('page.dashboard', ['ngCookies']);

dashboardModule.config(function($stateProvider, $urlRouterProvider){

	$stateProvider
		.state('dashboard', {
			url: '/dashboard',
			controller: 'dashboardCtrl',
			templateUrl: '../../partials/dashboard.html'
		})
})

dashboardModule.run(function($cookies, $state) {
	if (!$cookies.get('token')) {
		window.location = settings.webUrl + settings.pageUrl.HOME;
	}
})

dashboardModule.controller('dashboardCtrl', ['$scope', function($scope) {
	$scope.changeLoginState(true);
}]);
/**
 * Created by nguyenlinh on 7/19/17.
 */
var firstCourseModule = angular.module('page.firstCourse', ['ngCookies']);

firstCourseModule.config(function($stateProvider, $urlRouterProvider){

	$stateProvider
		.state('firstcourse', {
			url: '/firstcourse',
			controller: 'firstCourseCtrl',
			templateUrl: '../../partials/firstcourse.html'
		})
		.state('firstcourse.introduction', {
			url: '/introduction',
			controller: 'firstCourse.Introduction.Ctrl',
			templateUrl: '../../partials/firstcourse/introduction.html'
		})
		.state('firstcourse.content', {
			url: '/content',
			controller: 'firstCourse.Content.Ctrl',
			templateUrl: '../../partials/firstcourse/content.html'
		})
})

firstCourseModule.run(function($cookies, $state) {
	if (!$cookies.get('token')) {
		window.location = settings.webUrl + settings.pageUrl.HOME;
	}
})

firstCourseModule.controller('firstCourseCtrl', ['$scope', function($scope) {
	$scope.changeLoginState(true);
}]);

firstCourseModule.controller('firstCourse.Introduction.Ctrl', ['$scope', '$state', function($scope, $state) {

	$scope.registerCourse = function() {
		// Call to server

		// Redirect to content page
		$state.go('firstcourse.content');
	}
}]);

firstCourseModule.controller('firstCourse.Content.Ctrl', ['$scope', '$state', function($scope, $state) {
}]);


/**
 * Created by nguyenlinh on 7/17/17.
 */
var forgotPasswordModule = angular.module('page.forgotPassword', []);

forgotPasswordModule.config(function($stateProvider, $urlRouterProvider){

	$stateProvider
		.state('forgotPassword', {
			url: '/forgotPassword',
			controller: 'forgotPasswordCtrl',
			templateUrl: '../partials/forgotPassword.html'
		})
});

forgotPasswordModule.controller('forgotPasswordCtrl', ['$scope', '$http', 'settings', 'authService',
	function ($scope, $http, settings, authService) {

	$scope.user = {
		email: ""
	};

	$scope.forgot = function() {

		authService.forgotPassword($scope.user).then(function(response) {

			showPopUp("We have sent you password reset instructions.");

		}, function(error) {

			showPopUp(error.data.error);
		})
	}
}]);
var homeModule = angular.module('page.home', []);

homeModule.config(function($stateProvider, $urlRouterProvider){

	$urlRouterProvider.otherwise('/home');

	$stateProvider
		.state('home', {
			url: '/home',
			controller: 'homeCtrl',
			templateUrl: '../partials/home.html'
		})
})

homeModule.controller('homeCtrl', ['$scope', '$http', function ($scope, $http) {

}]);

/**
 * Created by nguyenlinh on 7/15/17.
 */
var loginModule = angular.module('page.login', ['ngCookies']);

loginModule.config(function($stateProvider, $urlRouterProvider) {

	$stateProvider
		.state('login', {
			url: '/login',
			controller: 'loginCtrl',
			templateUrl: '../partials/login.html'
		})
})

loginModule.controller('loginCtrl', ['$scope', '$http', 'authService', 'settings', '$cookies', '$state',
			function($scope, $http, authService, settings, $cookies, $state) {

	$scope.user = {};

	$scope.login = function() {

		authService.login($scope.user).then(function (response) {

			$cookies.put('token', response.data);

			$state.go('dashboard');

		}, function (error) {

			showPopUp(error.data.error);

		})
	}
}]);


/**
 * Created by nguyenlinh on 7/15/17.
 */
var registrationModule = angular.module('page.registration', ['ngCookies']);

registrationModule.config(function($stateProvider, $urlRouterProvider){

	$stateProvider
		.state('registration', {
			url: '/registration',
			controller: 'registrationCtrl',
			templateUrl: '../partials/registration.html'
		})
});

registrationModule.controller('registrationCtrl', ['$scope', '$http', 'authService', 'settings', '$cookies',
	function ($scope, $http, authService, settings, $cookies) {

	$scope.user = {};

	$scope.register = function() {

		authService.register($scope.user).then(function(response) {

			showPopUp("Create account successfully.");

			setTimeout(function() {
				$cookies.put('token', response.data.token);
				window.location = settings.pageUrl.DASH_BOARD;
			}, 2000);

		}, function(error) {
			showPopUp(error.data.error);
		})
	}
}]);
/**
 * Created by nguyenlinh on 7/17/17.
 */
var resetPasswordModule = angular.module('page.resetPassword', []);

resetPasswordModule.config(function($stateProvider, $urlRouterProvider){

	$stateProvider
		.state('resetPassword', {
			url: '/resetPassword?token',
			controller: 'resetPasswordCtrl',
			templateUrl: '../partials/resetPassword.html'
		})
});

resetPasswordModule.controller('resetPasswordCtrl', ['$scope', '$http', 'settings', 'authService', '$stateParams',
	function ($scope, $http, settings, authService, $stateParams) {

		$scope.user = {
			password: "",
			confirmPassword: "",
			token: $stateParams.token
		};

		$scope.reset = function() {
			authService.resetPassword($scope.user).then(function(response) {

				console.log(response);
			})
		}
	}]);
/**
 * Created by nguyenlinh on 7/16/17.
 */
var authServiceModule = angular.module('service.auth', ['ngCookies']);

authServiceModule.factory('authService', function($http, $q, settings) {

	return {
		login: function(data) {

			return $http.post(settings.apiUrl + '/login', data);

		},
		register: function(data) {

			return $http.post(settings.apiUrl + '/register', data);

		},
		forgotPassword: function(data) {

			return $http.post(settings.apiUrl + '/forgotPassword', data);
		},
		resetPassword: function(data) {

			return $http.post(settings.apiUrl + '/resetPassword', data);
		}
	}
})
