(function() {
	function time(date) {
		date = moment(date);
		var time = $('<time />');
		time.attr('datetime', date.format());
		time.attr('title', date.calendar());
		time.text(date.fromNow());
		return time;
	}
	$('article').each(function() {
		var $this = $(this);
		
		var publishDateISO = $this.attr('data-publish-date');
		var publishDate = new Date(publishDateISO);

		var editDateISO = $this.attr('data-edit-date');
		var editDate = editDateISO === publishDateISO ?
			publishDate :
			new Date(editDateISO);

		var $metadata = $this.children('header').children('.metadata');
		
		$metadata
			.append('<dt>published</dt>')
			.append($('<dd/>').append(time(publishDate)));
		
		if (editDate !== publishDate) {
			$metadata
				.append('<dt>last edited</dt>')
				.append($('<dd/>').append(time(editDate)));
		}

		$metadata.removeClass('hidden');
	});
})();