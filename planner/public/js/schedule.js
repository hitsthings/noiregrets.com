define('schedule', ['exports'], function(exports) {

	function Frequency(val, allowsExceptionSchedule, maxMax, minMax, min) {
		this.val = val;
		this.exceptionsAllowed = allowsExceptionSchedule;
		this.maxMax = maxMax;
		this.minMax = minMax || maxMax;
		this.min = min || 0;
		this.absolute = !!this.min;
	}
	Frequency.prototype.valueOf = 
		Frequency.prototype.toString = function() { return this.val; };
	Frequency.prototype.maxValue = function() { return this.maxMax; };
	Frequency.prototype.getScheduleBuilder = function() {
		return this.exceptionsAllowed ?
			new ScheduleBuilderWithExceptions(this) :
			new ScheduleBuilder(this);
	};
	Frequency.prototype.assertValidRange = function(start, end) {
		var startIsPast, startAfterEnd, startTooFar;

		if (this.absolute) {
			if (start < min) startIsPast = true;
			else if (start > this.minMax) startTooFar = true;
			else if (start >= end) startAfterEnd = true;
		} else {
			if (this.minMax + start < 0) startIsPast = true;
			else if (this.start > this.minMax) startTooFar = true;
			else {	
				if (end == null) end = this.maxMax;
				
				if ((start < 0 && end < 0 && start <= end) ||
					(start < 0 && this.maxMax + start >= end) ||
					(end < 0 && start >= this.minMax + end)) {
					startAfterEnd = true;
				}
			}
		}
		
		if (startIsPast) {
			throw new Error('Start time ' + (start < -this.maxMax ? 'is' : 'can be') + ' in the past.');
		}
		if (startTooFar) {
			throw new Error('Start time ' + (start > this.maxMax ? 'is' : 'can be') + ' past the end of this frequency range.');
		}
		if (startAfterEnd) {
			throw new Error('Start time is/can be after end time.');
		}
		
	};
	Frequency.ONCE = new Frequency('ONCE', true, Infinity, Infinity, new Date());
	Frequency.HOURLY = new Frequency('HOURLY', false, 60);
	Frequency.DAILY = new Frequency('DAILY', false, 60 * 24);
	Frequency.WEEKLY = new Frequency('WEEKLY', true, 60 * 24 * 7);
	Frequency.MONTHLY = new Frequency('MONTHLY', true, 60 * 24 * 31, 60 * 24 * 28);
	Frequency.YEARLY = new Frequency('YEARLY', true, 60 * 24 * 366, 60 * 24 * 365);
	Frequency.isValid = function(freq) {
		return freq && freq.valueOf && this.hasOwnProperty(freq.valueOf());
	};
		
	function createTimespan(start, end) {
		return {
			start : start,
			end : end
		};
	}

	function createSchedule(frequency, times, exceptionSchedules) {
		return {
			frequency : frequency,
			times : times || [],
			exceptions : exceptionSchedules || []
		};
	}

	function ScheduleBuilder(freq) {
		this._freq = freq;
		this._times = [];
		this._exceptions = [];
	}
	ScheduleBuilder.prototype.addTimespan = function(start, end) {
		this._freq.assertValidRange(start, end);
		this._times.push(createTimespan(start, end));
		
		return this;
	};
	ScheduleBuilder.prototype.build = function() {
		return createSchedule(this._freq, this._times, this._exceptions);
	};

	function ScheduleBuilderWithExceptions (freq) {
		ScheduleBuilder.call(this, freq);
	}
	ScheduleBuilderWithExceptions.prototype = Object.create(ScheduleBuilder.prototype);
	ScheduleBuilderWithExceptions.prototype.addExceptionSchedule = function(schedule) {
		this._exceptions.push(schedule);
		
		return this;
	};
	
	exports.Frequency = Frequency;
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	function extender() {}
	function extend(sub_, super_) {
		extender.prototype = super_.prototype;
		sub_.prototype = new extender();
	}
	
	var hasOwn = Object.prototype.hasOwnProperty;
	function clone(obj) {
		var newObj = {};
		for(var key in obj) { if (hasOwn.call(obj, key)) {
			newObj[key] = obj[key];
		}}
		return newObj;
	}
	
	function enumToArray(theEnum) {
		var arr = [];
		
		for(var item in theEnum) { if (hasOwn.call(theEnum, item)) {
			var copy = clone(theEnum[item]);
			copy.name = item;
			arr.push(copy);
		}}
		
		arr.sort(function(a, b) { return a.order - b.order; });
		
		return arr;
	}
	
	function abstractFunction() { throw new Error('Abstract function not implemented.'); }
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	var weekdayArray,
		monthArray,
		defaultLocalization = {
			locale : '',
			days : {
				Sunday : {abbr : 'sun', order : 1},
				Monday : {abbr : 'mon', order : 2},
				Tuesday : {abbr : 'tue', order : 3},
				Wednesday : {abbr : 'wed', order : 4},
				Thursday : {abbr : 'thu', order : 5},
				Friday : {abbr : 'fri', order : 6},
				Saturday : {abbr : 'sat', order : 7}
			},
			getUTCDay : function(epochMillis) {
				return weekdayArray[new Date(epochMillis).getUTCDay()];
			},
			getWeekLength : function() { return weekdayArray.length; },
			getUTCWeekEnd : function(epochMillis) {
				var date = new Date(epochMillis);
				date.setUTCDay(7);
				date.setUTCHours(0);
				date.setUTCMinutes(0);
				date.setUTCSeconds(0);
				date.setUTCMilliseconds(-1);
				return +date;
			}
			months : {
				January : {abbr : 'jan', order : 1},
				February : {abbr : 'feb', order : 2},
				March : {abbr : 'mar', order : 3},
				April : {abbr : 'apr', order : 4},
				May : {abbr : 'may', order : 5},
				June : {abbr : 'jun', order : 6},
				July : {abbr : 'jul', order : 7},
				August : {abbr : 'aug', order : 8},
				September : {abbr : 'sep', order : 9},
				October : {abbr : 'oct', order : 10},
				November : {abbr : 'nov', order : 11},
				December : {abbr : 'dec', order : 12}
			},
			getUTCMonth : function(epochMillis) {
				return monthArray[new Date(epochMillis).getMonth()];
			},
			getUTCMonthEnd : function(epochMillis) {
				var date = new Date(epochMillis);
				date.setUTCMonth(date.getUTCMonth()+1);
				date.setUTCDate(1);
				date.setUTCHours(0);
				date.setUTCMinutes(0);
				date.setUTCSeconds(0);
				date.setUTCMilliseconds(-1);
				return +date;
			}
		};
	weekdayArray = enumToArray(defaultLocalization.days);
	monthArray = enumToArray(defaultLocalization.months);
	
	
	
	
	
	
	
	var localizationPacks = {},
		currentLocale;
	function loadLocalizationPack(pack) {
		localizationPacks[pack.locale] = pack;
	}
	function setLocale(locale) {
		currentLocale = localizationPacks[pack.locale];
	}
	
	
	
	
	
	
	
	
	
	
	function Schedule(occurrences, recurrences) {
		this.occurrences = occurrences ?
							occurrences instanceof Array ?
								occurrences :
								[ occurrences ] :
							[];
		this.recurrences = recurrences ?
							recurrences instanceof Array ?
								recurrences :
								[ recurrences ] :
							[];
	}
	Schedule.prototype.addOccurrence = function(occurrence) {
		this.occurrences.push(occurrence);
	};
	Schedule.prototype.addRecurrence = function(recurrence) {
		this.recurrences.push(recurrence);
	};
	Schedule.prototype.getNextOccurrence = function(afterAbsoluteTime) {
		var anchor = AbsoluteTime.normalize(afterAbsoluteTime);
		
		var min = { millis : Number.MAX_VALUE, occurrence : null};
		for(var i = 0, l = this.occurrences.length; i < l; i++) {
			if (this.occurrences[i].getNextOccurrence(anchor)) {
				
			}
		}
	};
	
	function Occurrence(timeRange, data) {
		this.timeRange = timeRange;
		this.data = data;
	}
	Occurrence.fromStartAndEndTimes = function (timeStart, timeEnd, data) {
		return new Occurrence(TimeRange.fromStartAndEndTimes(timeStart, timeEnd), data);
	};
	Occurrence.fromStartAndDuration = function (timeStart, durationMillis, data) {
		return new Occurrence(TimeRange.fromStartAndDuration(timeStart, durationMillis), data);
	};
	
	function Time() {}
	Time.prototype.toAbsoluteTime = abstractFunction;
	Time.normalize = function(value) {
		if (!value) return null;
		
		if (value instanceof Time) {
			return value;
		}
		
		if (typeof value.toAbsoluteTime === 'function') {
			return AbsoluteTime.normalize(value.toAbsoluteTime(AbsoluteTime.now()));
		}
		
		if (!isNaN(+value)) {
			return new AbsoluteTime(+value);
		}
		
		return null;
	};
	
	function AbsoluteTime(epochMillis) {
		this.epochMillis = epochMillis;
	}
	extend(AbsoluteTime, Time);
	
	AbsoluteTime.prototype.toAbsoluteTime = function(anchorTime) { return this; };
	
	Time.now = AbsoluteTime.now = function() { return new AbsoluteTime(+new Date()); };
	AbsoluteTime.normalize = function(time) {
		if (!time) null;
		
		if (!(time instanceof Time) && typeof time.toAbsoluteTime === 'function') {
			time = time.toAbsoluteTime(AbsoluteTime.now());
			if (!time) return null;
		}
		
		if (time instanceof Time) {
			return time.toAbsoluteTime(AbsoluteTime.now());
		}
		
		if (typeof time === 'number') {
			return new AbsoluteTime(time);
		}
		
		return null;
	};
	
	function RelativeTime(relativeToTime, timeOffset) {
		this.anchor = relativeToTime;
		this.offset = timeOffset;
	}
	extend(RelativeTime, Offset);
	RelativeTime.prototype.toAbsoluteTime = function(anchorTime) {
		this.offset.toMilliseconds(this.anchor.toAbsoluteTime(anchorTime))
	};
	
	function TimeOffset(millis) {
		Time.call(this);
		this.millis = millis;
	}
	extend(TimeOffset, Time);
	TimeOffset.prototype.toAbsoluteTime = function(anchorTime) {
		var absoluteTime = anchorTime;
		return new AbsoluteTime(absoluteTime.epochMillis + this.amount);
	};
	
	function CalendarOffset(calendarValue) {
		TimeOffset.call(this, null);
		
		this.value = calendarValue;
	}
	extend(CalendarOffset, TimeOffset);
	CalendarOffset.prototype.toAbsoluteTime = function(anchorTime) {
		
	};
	
	function CalendarValue(calendarType, value, toAbsoluteTime) {
		this.type = calendarType;
		this.value = value;
		this.toAbsoluteTime = 
	}
	
	
	var CalendarType = {
		Day : { name: 'ms', 'day', toAbsoluteTime : function(value, anchorTime) {
		
			return anchorTime.epochMillis + this.value + currentLocalization
		}, millis: 1000 * 60 * 60 * 24},
		Date : { name: 'ms', 'date', millis: 1000 * 60 * 60 * 24},
		Week : { name: 'ms', 'week', millis: 1000 * 60 * 60 * 24 * 7},
		Month : { name: 'ms', 'month'},
		Year : { name: 'ms', 'year'}
	};
	
	AbsoluteTime.now().next(Weekday.Wednesday).next(Month).last(Weekday.Wednesday);
	
	function TimeRange(timeStart, timeEnd) {
		this.timeStart = timeStart;
		this.timeEnd = timeEnd;
	}
	TimeRange.fromStartAndEndTimes = function (timeStart, timeEnd, ) {
		return new TimeRange(timeStart, timeEnd || timeStart);
	};
	TimeRange.fromStartAndDuration = function(timeStart, durationMillis) {
		var timeEnd = durationMillis ?
			new RelativeTime(timeStart, new TimeOffset(durationMillis)) :
			timeStart;
		return TimeRange.fromStartAndEndTimes(timeStart, timeEnd);
	};
	
	function Recurrence(timeOffset, recurrenceLimit) {
		this.timeOffset = timeOffset;
		this.recurrenceLimit = recurrenceLimit;
	}
	Recurrence.create = function(timeOffset, timeOrCountLimit) {
		return new Recurrence(timeOffset, new RecurrenceLimit(timeOrCountLimit));
	}
	
	function RecurrenceLimit(timeOrCount) {
		this.count = null;
		this.time = null;
		if (typeof timeOrCount === 'number') {
			this.count = timeOrCount;
		} else {
			this.time = timeOrCount;
		}
	}
	

});

























