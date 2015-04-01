var app = app || {};

$(function() {
	'use strict';

	app.ChannelList = [
		'demoreels',
		'staffpicks',
		'documentaryfilm',
		'everythinganimated',
		'nicetype',
		'1nspirational',
		'1341'
	];

	function getChannelURL(channel, type) {
		if (type === "info") {
			return "http://vimeo.com/api/v2/channel/" + channel + "/info.json";
		} else {
			return "http://vimeo.com/api/v2/channel/" + channel + "/videos.json";
		}
		
	}

	new app.AppView();

});