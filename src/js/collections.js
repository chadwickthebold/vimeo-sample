var app = app || {};

$(function() {
	'use strict';

	// Collection of Videos in the channel
	app.Videos = Backbone.Collection.extend({
		model : app.Video
	});

});