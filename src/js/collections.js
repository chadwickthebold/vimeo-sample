var app = app || {};

$(function() {
	'use strict';

	// Collection of Videos in the channel
	app.VideoList = Backbone.Collection.extend({
		model : app.Video
	});

});