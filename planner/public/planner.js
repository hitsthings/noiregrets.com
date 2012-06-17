define('planner', ['schedule'], function(Scheduling) {

	var plannerKey = "planner.noiregrets.com";
	var tokenQS = 'token';
	
	function updateTokenFromQS() {
		if (location.search) {
			for(var param in location.search.substring(1).split('&')) { // each variable
				if (param.substring(0, tokenQS.length) === tokenQS) { // if it's the token
					localStorage[plannerKey] = param.substring(tokenQS.length + 1); // save it
				}
			}
		}
	}
		
	function getToken() {
		return localStorage[plannerKey];
	}

	
	
	function Planner() {
		if (!window.localStorage) {
			console.warn('This browser doesn\'t support localStorage, and therefore is \
				unsupported by Spontaneous Planner.');
			return {};
		}
		
		updateTokenFromQS();
	}
	var proto = Planner.prototype;
	
	proto.verifyToken = function() {
		var deferred = new $.Deferred();
		
		if (!getToken()) deferred.reject('No token.'); 
		else {
			$.ajax({
				url: 'verifyToken',
				dataType : 'json',
				data : { token : getToken() }
			}).
				fail(function() { deferred.reject('Ajax request failed.'); }).
				done(function(data) {
					data.verified ? deferred.resolve() : deferred.reject('Invalid token.');
				});
		}
		
		return deferred.promise();
	};
	
	proto.email = function(subject, body) {
		return {
			subject: subject,
			body : body
		};
	};
	
	proto.createPlan = function(planName, mailAttributes, schedules) {
		var deferred = new $.Deferred();
		
		$.ajax({
				url: 'createPlan',
				method: 'POST',
				dataType : 'json',
				data : {
					token : getToken(),
					name : planName,
					mail : mailAttributes
					schedules : $.isArray(schedules) ? schedules : [ schedules ]
				}
			}).
				fail(function() { deferred.reject('Ajax request failed.'); }).
				done(function(data) {
					data.verified ? deferred.resolve() : deferred.reject('Invalid token.');
				});
		
		return deferred.promise();
	};
	
	proto.getPlans = function(filter, offset) {
		var deferred = new $.Deferred();
		
		
		
		return deferred.promise();
	};
	
	proto.updatePlan = function() {
		var deferred = new $.Deferred();
		
		
		
		return deferred.promise();
	};
	
	proto.deletePlan = function() {
		var deferred = new $.Deferred();
		
		
		
		return deferred.promise();
	};
	
	proto.Frequency = Scheduling.Frequency;
	
	return new Planner();
});
var planner = new (require('planner'));