var mongoose = require('mongoose');

var Schedule = require('./lib/model/schedule');
var Recurrence = require('./lib/model/recurrence');
var time = require('./lib/model/time');

var go = (function(
    Schedule,
    Recurrence,
    AbsoluteTime,
    RelativeTime,
    CalendarTimeOffset,
    CalendarValue) {

    return function() {
/**/        var calVal = new CalendarValue({
            calendarType:'weekday',
            calendarIndex: 2
        });

        var calOffset = new CalendarTimeOffset({
            calendarValue : calVal,
            count: 1
        });

        var recurrence = new Recurrence({
            offset: calOffset,
            limit:1
        });

        var time = new RelativeTime({
            anchor : new AbsoluteTime({
                epochMillis : Date.now()
            }),
            offset : calOffset
        });

        var schedule = new Schedule({
            occurrences : [ time ],
            recurrences : [ recurrence ]
        });

                console.dir(schedule);
                console.dir(schedule.occurrences[0]);
                console.dir(schedule.occurrences[0].offset);
                console.dir(schedule.occurrences[0].offset.calendarValue);

        schedule.save(function(err, res) {
            if (err) { throw err; }//*/

            Schedule.find({}, function(err, res) {
                if (err) { throw err; }

                console.dir(res[0]);
                console.dir(res[0].occurrences[0]);
                console.dir(res[0].occurrences[0].offset);
                console.dir(res[0].occurrences[0].offset.calendarValue);
            });
        });
    };

})(
    Schedule,
    Recurrence,
    time.AbsoluteTime,
    time.RelativeTime,
    time.CalendarTimeOffset,
    time.CalendarValue
);

mongoose.connect('mongodb://localhost/test', go);