var app = app || {};

$(function() {
	'use strict';


	// Video Model
	app.Video = Backbone.Model.extend({
		initialize: function() {
			var time_ago = moment(this.get('upload_date')).fromNow();
 
			this.set('time_ago', time_ago);
		}
	});


	// Channel Model
	app.Channel = Backbone.Model.extend({


		defaults: {
			'channel_identifier' : 'demoreels'
		},


		url: function() {
			return "http://vimeo.com/api/v2/channel/" + this.get('channel_identifier') + "/info.json";
		},


		// Request more videos and add them to the collection
		loadMoreVideos: function() {
			var channel = this,
					next_page = channel.pagesLoaded + 1;

			return $.get("http://vimeo.com/api/v2/channel/" + this.get('channel_identifier') + "/videos.json?page=" + next_page, function(videoArray) {
				channel.Videos.add(videoArray);
				channel.pagesLoaded += 1;
			});
		},

		
		initialize: function() {
			this.pagesLoaded = 0;

			this.Videos = new app.Videos();
		}


	});

});