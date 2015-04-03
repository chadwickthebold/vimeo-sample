var app = app || {};

$(function() {
	'use strict';

	// List of sample channels available for navigation
	app.ChannelList = [
		'demoreels',
		'staffpicks',
		'documentaryfilm',
		'everythinganimated',
		'nicetype',
		'1nspirational',
		'1341'
	];

	// Initialize the overall AppView
	new app.AppView();

});