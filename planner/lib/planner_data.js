var sqlite = require('persistence/sqlite'),
	EventEmitter = require('events').EventEmitter;
	
	function PlannerDB(sqliteConnection) {
		var that = this;
		sqliteConnection.addListener('connection', function() {
			that.emit('connection');
		});
		
		sqliteConnection.addListener('error', function(err) {
			console.error(err.toString('utf8'));
		})
		
		this.query = function() {
			return sqliteConnection.query.apply(sqliteConnection, arguments);
		};
	}
	PlannerDB.prototype = new EventEmitter();
	
	PlannerDB.prototype.addMessage = function(emailAddress, subject, body, callback) {
		this.query(
			"insert into messages (to_emailAddress_id, subject, body) select emailAddress_id, :subject, :body from emailAddress where emailAddress_full = :emailAddress and comfirmed = 1;" +
			"select message_id from messages inner join emailAddress on to_emailAddress_id = emailAddress_id where emailAddress_full = :emailAddress and subject = :subject and body = :body;", {
				emailAddress : emailAddress,
				subject : subject,
				body : body
			}, function(data) {
				callback(data.length ? data[0].message_id : null);
			});
	};
	PlannerDB.prototype.scheduleMessage = function(message_id, sendDate, callback) {
		this.query(
			"insert into message_schedule (message_id, send_date) values (:message_id, :sendDate);", {
				message_id : message_id,
				sendDate : sendDate
			}, function(data) {
				callback();
			});
	};
	PlannerDB.prototype.getMessagesToSend = function getMessagesToSend(endDate, callback) {
		this.query(
			"select messages.message_id, send_date, emailAddress_full as emailAddress, subject, body " +
			"from message_schedule " + 
				"inner join messages on message_schedule.message_id = messages.message_id " + 
				"inner join emailAddress on messages.to_emailAddress_id = emailAddress.emailAddress_id " + 
			"where sent = 0 and send_date < :endDate;", {
				endDate : endDate
			}, function(data) {
				callback(data);
			});
	};
	PlannerDB.prototype.markMessagesSent = function markSentUntil(endDate, callback) {
		this.query(
			"update message_schedule set sent = 1 where send_date < :endDate;", {
				endDate : endDate
			}, function(data) {
				callback();
			});
	};