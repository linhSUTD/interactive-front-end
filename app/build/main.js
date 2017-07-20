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
	webUrl: 'http://localhost:3000/#!',
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

app.run(function ($cookies, $state, settings) {
	if ($cookies.get('token')) {
		window.location = settings.webUrl + settings.pageUrl.DASH_BOARD;
	}
})

app.controller('baseCtrl', ['$scope', '$cookies', 'settings', function ($scope, $cookies, settings) {

	$scope.isLoggedIn = false;

	if ($cookies.get('token')) {
		$scope.isLoggedIn = true;
	}

	$scope.logout = function () {
		$cookies.put('token', undefined);
		$scope.isLoggedIn = false;
		window.location = settings.webUrl + settings.pageUrl.HOME;
	}

	$scope.changeLoginState = function (val) {
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

dashboardModule.config(function ($stateProvider, $urlRouterProvider) {

	$stateProvider
		.state('dashboard', {
			url: '/dashboard',
			controller: 'dashboardCtrl',
			templateUrl: '../../partials/dashboard.html'
		})
})

dashboardModule.run(function ($cookies, $state, settings) {
	if (!$cookies.get('token')) {
		window.location = settings.webUrl + settings.pageUrl.HOME;
	}
})

dashboardModule.controller('dashboardCtrl', ['$scope', function ($scope) {
	$scope.changeLoginState(true);
}]);

var firstCourseModule = angular.module('page.firstCourse', ['ngCookies']);

firstCourseModule.config(function ($stateProvider, $urlRouterProvider) {

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

firstCourseModule.run(function ($cookies, $state, settings) {
	if (!$cookies.get('token')) {
		window.location = settings.webUrl + settings.pageUrl.HOME;
	}
})

firstCourseModule.controller('firstCourseCtrl', ['$scope', function ($scope) {
	$scope.changeLoginState(true);
}]);

firstCourseModule.controller('firstCourse.Introduction.Ctrl', ['$scope', '$state', function ($scope, $state) {
	$scope.registerCourse = function () {
		// Call to server

		// Redirect to content page
		$state.go('firstcourse.content');
	}
}]);

firstCourseModule.controller('firstCourse.Content.Ctrl', ['$scope', '$state', 'ExerciseLoader', 'BackendSessionManager', function ($scope, $state, exerciseLoader, backendSessionManager) {
	function createImageSrc(payload) {
		if (payload.lastIndexOf("http", 0) === 0) {
			return payload;
		}
		// New SVGs (from Python) com in base64 - they always start with PD94
		if (payload.startsWith('PD94')) {
			return 'data:image/svg+xml;base64,' + payload;
		}
		// PNGs (from R) come in hex; need to convert to base 64
		return 'data:image/png;base64,' + hexToBase64(payload);
	}

	require.config({ paths: { 'vs': 'https://microsoft.github.io/monaco-editor/node_modules/monaco-editor/min/vs' } });

	var initialized = false;
	var editor;
	function loadNewExercise() {
		$scope.graphSrc = "";
		$scope.outputText = null;

		var exercise = exerciseLoader.getExercise(2);
		window.editor.setValue(exercise.pre_exercise_code);

		return exercise;
	}

	function controllerMain() {
		initialized = true;

		window.editor = monaco.editor.create(document.getElementById('editor_panel'), {
			language: 'python',
			theme: 'vs-dark'
		});

		editor = window.editor;

		var exercise = loadNewExercise();
		var backend = backendSessionManager.createBackend(exercise.language, exercise);
	}

	function handleCodeOutput(output) {
		console.log(output);
		$scope.graphSrc = "null";
		$scope.outputText = null;
		for (var i = 0; i < output.length; i++) {
			if (output[i].type == "graph") {
				$scope.graphSrc = createImageSrc(output[i].payload);
			} else if (output[i].type == "output") {
				$scope.outputText = output[i].payload;
			}
		}
	}

	$scope.getGraphSrc = function () {
		return $scope.graphSrc || "";
	}

	$scope.onLoadNew = function () {
		loadNewExercise();
	}

	$scope.onSubmit = function () {
		// If there is no SCT, simply do a console command
		var action = backendSessionManager.runConsole;
		var code = window.editor.getValue();
		console.log(code);
		if (backendSessionManager.sessionActive()) {
			//Session is already active, just execute the code.

			action(code, true, data => handleCodeOutput(data));
		} else {
			// The function that will get called after the session is initialized properly.
			var turnOffListener = $scope.$on('session::ready', function () {
				turnOffListener();
				action(code, true, data => handleCodeOutput(data));
			});

			//First create a session
			backendSessionManager.startSession();
		}
	}

	require(['vs/editor/editor.main'], controllerMain);
}]);

/**
 * Created by nguyenlinh on 7/17/17.
 */
var forgotPasswordModule = angular.module('page.forgotPassword', []);

forgotPasswordModule.config(function ($stateProvider, $urlRouterProvider) {

	$stateProvider
		.state('forgotPassword', {
			url: '/forgotPassword',
			controller: 'forgotPasswordCtrl',
			templateUrl: '../partials/forgotPassword.html'
		})
});

forgotPasswordModule.controller('forgotPasswordCtrl', ['$scope', '$http', 'settings', 'authService', function ($scope, $http, settings, authService) {

	$scope.user = {
		email: ""
	};

	$scope.forgot = function () {

		authService.forgotPassword($scope.user).then(function (response) {

			showPopUp("We have sent you password reset instructions.");

		}, function (error) {

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
'use strict';

angular.module('page.firstCourse').factory('url', function () {
    return {
        sessionManager: 'https://multiplexer-prod.datacamp.com/'
    };
});

angular.module('page.firstCourse').factory('RenderService', ['$rootElement', function ($rootElement) {
    return {
        calculateRenderDimensions: calculateRenderDimensions
    };

    function calculateRenderDimensions() {
        return {
            'height': 200,
            'width': 856
        };
    }
}]);

angular.module('page.firstCourse').factory('BackendSessionManager', ['$http', '$timeout', '$interval', '$rootScope', 'url', 'PythonBackend', '$q', '$cookies', '$window', '$log', 'RenderService', function ($http, $timeout, $interval, $rootScope, url, PythonBackend, $q, $cookies, $window, $log, RenderService) {
    var MIN_POLL_INTERVAL = 1500;
    var MAX_POLL_INTERVAL = 10000;

    var LINE_PRINT_INTERVAL = 100;
    var RETRY_MIN_DELAY = 2000;
    var RETRY_JITTER = 8000;

    var newCount, backend;
    var sid = null;
    var authentication_token;
    var keepAlive;
    var sessionCounter = 0;
    var newRequestCanceller, readRequestCanceller, inputRequestCanceller;

    function logError(message, extra) {
        var logObject = {
            type: "error",
            source: "frontend",
            message: "message"
        };

        if (extra) {
            for (var k in extra) {
                logObject[k] = extra[k];
            }
        }

        // TODO: send logObject to fluent!
        // The new shit's fucked
        $log.log(message);
    }

    /**
     * Inspired by http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript/
     */
    function generateUUID() {
        var d;
        if (Date.now)
            d = Date.now();
        else
            d = new Date().getTime();
        if ($window.performance && angular.isFunction($window.performance.now)) {
            d += performance.now(); //use high-precision timer if available
        }
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }

    function handleBrokenSession(sidSnapshot, error) {
        if (sid == sidSnapshot) {
            sid = null;
            var msg = ["Your session has been disconnected."];
            if (error.data === "Invalid SID") {
                msg.push("You might have been idle for too long or have another session active.");
            } else if (error.data === "Session crashed") {
                msg.push("The performed operation was too resource-intensive.");
            }
            broadcastEvent('session::broken', msg.join(' '));
        }
    }

    function handleHTTPErrors(sidSnapshot, error) {
        switch (error.status) {
            case 0: {
                // refused/timed out
                // TODO: tell the user what happened

                //this is called for both cancel and refuse
                //In case of cancel nothing should happen
                //In case of refuse, message should be showed and other requests should be cancelled
                //timeouts cancelled.
                if (readRequestCanceller != null)
                    handleBrokenSession(sidSnapshot, error);
            }
                break;

            case -1: {
                // This is normal, don't do anything.
            }
                break;

            case 403: {
                handleBrokenSession(sidSnapshot, error);
            }
                break;

            default: {
                logError("the multiplexer gave us an error (handleHTTPErrors): " + angular.toJson(error));
            }
                break;
        }
    }

    function sendKeepAlive(pollInterval) {
        $timeout.cancel(keepAlive);

        keepAlive = $timeout(function () {
            if (sid != null) {
                var sidSnapshot = sid;
                readRequestCanceller = $q.defer();
                $http.post(
                    url.sessionManager + 'read?sid=' + sid + '&newCount=' + newCount,
                    angular.toJson({ random: Date.now(), authentication_token: authentication_token }),
                    { responseType: 'text', timeout: readRequestCanceller.promise }
                ).then(handleInputResponse, function (error) {
                    handleHTTPErrors(sidSnapshot, error);
                });
                sendKeepAlive(Math.min(pollInterval * 1.2, MAX_POLL_INTERVAL));
            }
        }, pollInterval);

    }

    function sendInput(input, cb) {
        // POST a string to the backend and call cb on successful responses

        // this probably means our code is wrong
        if (sid === null) {
            logError('don\'t call sendInput with no session active!');
            return;
        }

        var sidSnapshot = sid;
        inputRequestCanceller = $q.defer();
        $http.post(
            url.sessionManager + 'input?sid=' + sid + '&newCount=' + newCount,
            angular.toJson({ command: input, authentication_token: authentication_token }),
            { responseType: 'text', timeout: inputRequestCanceller.promise }
        ).then(cb, function (error) {
            handleHTTPErrors(sidSnapshot, error);
        });
        sendKeepAlive(MIN_POLL_INTERVAL);
    }

    function sendCall(command, message, callback) {
        if (!command) return;
        // little helper function to call backend functions
        broadcastEvent("session::busy", message ? message : "Executing...");
        sendInput(command, function (response) {
            var output = handleInputResponse(response);
            if (callback && !!output) {
                callback(output);
            }
        });
    }

    function executeInitSessionRequest() {
        sendCall(backend.getInitCommand(), "Setting Up Workspace");
    }

    function executeNewSessionRequest(forceNew) {
        if (newRequestCanceller != null) {
            newRequestCanceller.resolve("New '?new' request send before previous one finished.");
            newRequestCanceller = null;
        }
        newRequestCanceller = $q.defer();

        var counterSnapshot = sessionCounter;

        //If cookies are not supported (could be due sandboxed iframe -> snippet), don't require storing the UUID.
        var cookiesSupported = true;

        try {
            authentication_token = $cookies.get('UUID');
        } catch (e) {
            cookiesSupported = false;
        }
        if (typeof (authentication_token) === 'undefined') {
            authentication_token = generateUUID();
        }
        if (cookiesSupported) {
            $cookies.put('UUID', authentication_token);
        }

        $http.post(
            url.sessionManager + 'new?language=' + backend.language + "&force_new=" + forceNew,
            angular.toJson({
                authentication_token: authentication_token,
                email: authentication_token
            }),
            { responseType: 'text', timeout: newRequestCanceller.promise }
        ).then(function (response) {
            newRequestCanceller = null;

            if (sessionCounter == counterSnapshot) {
                sid = response.data.id;
                newCount = response.data.newCount;
                executeInitSessionRequest();
            }
        }, function () {
            if (sessionCounter == counterSnapshot) {
                $timeout(function () {
                    executeNewSessionRequest(forceNew)
                }, RETRY_MIN_DELAY + Math.random() * RETRY_JITTER);
            }
        });
    }

    function broadcastEvent(eventName, message) {
        $rootScope.$broadcast(eventName, message);
    }

    function unmangleJSON(str) {
        // responses from R contain strings that are almost json, but
        // include things like \n (backslash n, not a new line). for
        // example:
        //
        //     [\n {\n \"type\": \"output\",\n\"payload\": \"[1] 5\\n\" \n} \n]
        //
        // so we need to shoehorn those strings into something that
        // JSON.parse understands. specifically, this function makes
        // the following replacements:
        //
        //     "[\n" -> "["
        //     "{\n" -> "{"
        //     ",\n" -> ","
        //
        //     "\n]" -> "]"
        //     "\n}" -> "}"
        //
        //     "\x" -> "x" for all x

        // TODO(refactor): this is super fragile and will definitely
        // need reviewing if you change the backend's JSON library
        // Note: Pythonbackend also makes use of this function!

        return str.replace(/([{\[,])\\n/g, '$1').replace(/\\n([}\]])/g, '$1').replace(/\\(.)/g, '$1');
    }

    function handleInputResponse(response) {
        if (inputRequestCanceller == null) return;

        // take a response from the backend and extract the bit we
        // actually care about
        var emptyResponse = true;
        var match;
        while ((match = backend.getConfig().responseRegex.exec(response.data))) {
            var output = unmangleJSON(match[1]);
            emptyResponse = false;

            try {
                angular.forEach(angular.fromJson(output), function (line, idx) {
                    $timeout(function () {
                        backend.parseInputResponseLine(line);
                    }, (idx + 1) * LINE_PRINT_INTERVAL);
                });
            }
            catch (err) {
                logError("we couldn't parse a response from the backend (handleInputResponse): " + angular.toJson(err),
                    { line: match[1] });
            }
        }

        if (!emptyResponse) {
            sendKeepAlive(MAX_POLL_INTERVAL);
            broadcastEvent("session::ready");
        }

        try {
            return JSON.parse(output);
        } catch (ex) {
            return null;
        }

    }

    // ----------------------
    // -- Exported Methods --
    // ----------------------
    return {

        createBackend: function (programmingLanguage, exercise, renderDimensions) {
            if (angular.isUndefined(renderDimensions)) {
                renderDimensions = {
                    'height': 640,
                    'width': 640
                };
            }

            backend = new PythonBackend(exercise, renderDimensions);

            return backend;
        },

        sessionActive: function () {
            return sid !== null;
        },

        /*
         * start the multiplexer session
         */
        startSession: function () {
            sessionCounter++;
            backend.setRenderDimensions(RenderService.calculateRenderDimensions());
            executeNewSessionRequest(false);
            broadcastEvent("session::loading", "Setting Up Workspace");
        },

        /*
         * Submit code
         * @param code (string): the code that will be submitted
         * @param echo (boolean): if R should send the code back or only the output. (optional)
         */
        submitCode: function (code, echo) {
            sendCall(backend.getSubmitCommand(code, echo));
        },

        runConsole: function (code, echo, callback) {
            sendCall(backend.getConsoleCommand(code, echo), null, callback);
        },

        getBackendConfig: function () {
            return backend.getConfig();
        },

        resize: function (renderDimensions, index) {
            if (!sid) return;
            sendCall(backend.getResizeCommand(renderDimensions, index));
        },

        //Returns if expand is immediate.
        expand: function (renderDimensions, index) {
            if (!sid) return true;
            var cmd = backend.getExpandCommand(renderDimensions, index);
            sendCall(cmd);
            return cmd === null;
        }
    };
}]);

'use strict';

angular.module('page.firstCourse').factory('ExerciseLoader', ['$log', function ($log) {
    var i = 0;
    var code = [
        "print(\" ex1 \")",
        "print(\" ex2 \")",
        "import numpy as np \n\
import matplotlib.pyplot as plt\n\
\n\
print(\"sample output\") \n\
x = np.arange(0, 5, 0.1);\n\
y = np.sin(x)\n\
plt.plot(x, y)\n\
plt.show()"
    ];

    function getExercise(exerciseId) {
        return {
            pre_exercise_code: code[exerciseId],
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

'use strict';

angular.module("page.firstCourse").config(function ($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
    //rest of route code
});

angular.module('page.firstCourse').constant('PYTHON_CONFIG', {
    prompt: 'In [{count}]: ',
    promptRegex: /^(In |Out)\[\d+\]: /,
    promptToken: "identifier",
    newlineBeforePrompt: true,
    outputLabel: 'Out[{count}]: ',
    extension: 'py',
    console: 'IPython Shell',
    responseRegex: /\"(.*)\"\r?\n/g,
    aceMode: 'ace/mode/python'
}).factory('PythonBackend', ['$rootScope', 'PYTHON_CONFIG', function ($rootScope, PYTHON_CONFIG) {
    var currentCode, currentExercise, renderDimensions;

    function PythonBackend(exercise, renderDims) {
        renderDimensions = renderDims;
        currentExercise = exercise;
    }

    function formatCall(data, python_call) {
        // gives us a string that we can send to the backend to run python_call(data)

        // the json needs some fudging before we can use it because it:
        // 1. gets interpreted by Python and then by a JSON parser
        //    so we escape all the escapes
        // 2. gets wrapped in single quotes
        //    so we escape all the existing single quotes
        var fudged = angular.toJson(data).replace(/\\/g, '\\\\').replace(/'/g, "\\'");

        return python_call + "('" + fudged + "')";
    }

    function generateCodeObject(code, filename) {
        currentCode = code;
        return {
            DC_CODE: code,
            DC_FILENAME: filename
        }
    }

    PythonBackend.prototype.language = "python";

    PythonBackend.prototype.getConfig = function () {
        return PYTHON_CONFIG;
    };

    PythonBackend.prototype.getInitCommand = function () {
        var data = {
            DC_PEC: currentExercise.pre_exercise_code,
            DC_SCT: currentExercise.sct,
            DC_SOLUTION: currentExercise.solution,
            DC_RENDER_HEIGHT: renderDimensions.height,
            DC_RENDER_WIDTH: renderDimensions.width
        };
        return formatCall(data, "init");
    };

    PythonBackend.prototype.getSubmitCommand = function (code) {
        return formatCall(generateCodeObject(code, "script.py"), 'submit');
    };

    PythonBackend.prototype.getConsoleCommand = function (code) {
        return formatCall(generateCodeObject(code, "<stdin>"), 'console');
    };

    PythonBackend.prototype.setRenderDimensions = function (renderDims) {
        renderDimensions = renderDims;
    };

    PythonBackend.prototype.getResizeCommand = function (dimensions, index) {
        return null;
    };

    PythonBackend.prototype.getExpandCommand = function (dimensions, index) {
        return null;
    };

    function prepareScriptOutput(output, filename) {
        var lines = output.split("\n");
        var result = "\n<" + filename + "> output:\n    " + lines.join("\n    ");
        return result;
    }

    /*
     * Parses a single 'line' coming from python
     * Depending on the type of the line, different output will be shown or generated.
     * @param line (object): the line of code that will be parsed
     */
    PythonBackend.prototype.parseInputResponseLine = function (line) {
        var payload = line.payload;
        switch (line.type) {
            case 'script-output':
                $rootScope.$broadcast('output::output', prepareScriptOutput(payload.output, payload.script_name));
                break;
            case 'output':
                $rootScope.$broadcast('output::output', payload);
                break;
            case 'result':
                $rootScope.$broadcast('output::result', payload);
                break;
            case 'graph':
                $rootScope.$broadcast('output::plot', payload);
                break;
            case 'error':
                $rootScope.$broadcast('output::error', "\n" + payload);
                break;
            case 'backend-error':
                $rootScope.$broadcast('output::error', "\n" + payload);
                break;
            case 'sct':
                payload.submittedCode = currentCode;
                $rootScope.$broadcast('output::sct', payload);
                break;
        }
    };

    return PythonBackend;
}]);

/**
 * Created by nguyenlinh on 7/16/17.
 */
var authServiceModule = angular.module('service.auth', ['ngCookies']);

authServiceModule.factory('authService', function ($http, $q, settings) {

	return {
		login: function (data) {

			return $http.post(settings.apiUrl + '/login', data);

		},
		register: function (data) {

			return $http.post(settings.apiUrl + '/register', data);

		},
		forgotPassword: function (data) {

			return $http.post(settings.apiUrl + '/forgotPassword', data);
		},
		resetPassword: function (data) {

			return $http.post(settings.apiUrl + '/resetPassword', data);
		}
	}
})
