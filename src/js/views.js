var app = app || {};

$(function() {
	'use strict';

	// Channel View
	app.ChannelView = Backbone.View.extend({

	});


	// Video View
	app.VideoView = Backbone.View.extend({

	});


	// App View
	app.AppView = Backbone.View.extend({

		// Bind to an existing element
		el: '#channel_browser',


		initialize: function() {
			this.imageContainer = this.$('channel_image');
			this.title = this.$('channel_title');
			this.links = this.$('channel_links');
			this.stats = this.$('channel_stats');

			this.layoutToggle = this.$('layout_toggle');
			this.list = this.$('video_list');
			this.pager = this.$('video_pager');



		}

	});

});