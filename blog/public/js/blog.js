(function() {
	function time(date) {
		date = moment(date);
		var time = $('<time />');
		time.attr('datetime', date.format());
		time.attr('title', date.calendar());
		time.text(date.fromNow());
		return time;
	}
	$('article:not(.preview)').each(function() {
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

	function setupPreview($input, $preview, markdown, hljs) {
		if ($input.length && $preview.length) {
			var lastVal;
			setTimeout(function preview() {
				var newVal = $input.val();
				if (lastVal !== newVal) {
					if (markdown) {
						$preview.html(markdown.toHTML(newVal));
					} else {
						$preview.text(newVal);
					}

					if (hljs) {
						$preview.find('pre > code').each(function() {
							hljs.highlightBlock(this);
						});
					}
					
					lastVal = newVal;
				}
				
				setTimeout(preview, 500);
			}, 0);
		}
	}
	
	var $postTitle = $('input#title'), $titlePreview = $('#titlePreview').click(false);
	var $postBody = $('textarea#body'), $bodyPreview = $('#bodyPreview');

	setupPreview($postTitle, $titlePreview);
	setupPreview($postBody, $bodyPreview, require('/blog/lib/markdown.js'), hljs);

	hljs.initHighlighting();

})();