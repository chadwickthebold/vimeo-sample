var app = app || {};

$(function() {
	'use strict';


	// Video Model
	app.Video = Backbone.Model.extend({
		initialize: function() {
			var time_ago = moment(this.get('upload_date')).fromNow(),
					duration_seconds = this.get('duration'),
					duration_leftover,
					duration_minutes,
					duration_string;

			duration_leftover = duration_seconds % 60;

			duration_seconds -= duration_leftover;

			duration_minutes = duration_seconds / 60;

			duration_leftover = duration_leftover + "";
			if (duration_leftover.length < 2) {
				duration_leftover = "0" + duration_leftover;
			}

			duration_string = duration_minutes + ':' + duration_leftover;


			this.set('duration_string', duration_string);
 
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
					next_page = channel.get('pagesLoaded') + 1;

			return $.get("http://vimeo.com/api/v2/channel/" + this.get('channel_identifier') + "/videos.json?page=" + next_page, function(videoArray) {
				channel.Videos.add(videoArray);
				channel.set('pagesLoaded', next_page);
			});
		},

		
		initialize: function() {
			this.set('pagesLoaded', 0);

			this.Videos = new app.Videos();
		}


	});

});