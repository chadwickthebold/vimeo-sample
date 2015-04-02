var app = app || {};

$(function() {
	'use strict';


	// Video View
	app.VideoView = Backbone.View.extend({

		tagName: 'li',

		className: 'video-card',

		template: _.template($('#video_template').html()),

		render: function() {
			this.$el.html(this.template(this.model.toJSON()));

			return this;
		}

	});







	// Video List View
	app.VideoListView = Backbone.View.extend({

		el: '#channel_list',

		events: {
			'click #layout_list' : 'setListLayout',
			'click #layout_grid' : 'setGridLayout'
		},

		setListLayout: function() {

			if (!this.$video_list.is('.list-layout')) {
				this.$video_list.addClass('list-layout').removeClass('grid-layout');
			}
			
		},

		setGridLayout: function() {

			if (!this.$video_list.is('.grid-layout')) {
				this.$video_list.addClass('grid-layout').removeClass('list-layout');
			}

		},

		addOne: function(video) {
			var view = new app.VideoView({ model: video });
			this.$video_list.append(view.render().el);
		},

		render: function() {
			var videoList = this;

			videoList.$video_list.empty();

			videoList.collection.models.forEach(function(video) {
				videoList.addOne(video);
			});
		},

		initialize: function() {
			this.$video_list = this.$('#video_list');
			this.$listRadio = this.$('#layout_list');
			this.$gridRadio = this.$('#layout_grid');

			this.$gridRadio.attr('checked', 'true');
			this.setGridLayout();

			this.render();

			this.collection.on('add', this.addOne, this);
		}

	});








	// Channel View
	app.ChannelView = Backbone.View.extend({


		el: '#channel_browser',


		events: {
			'click #video_pager' : 'loadNextPage'
		},


		// Video Pager functionality
		loadNextPage: function() {
			var view = this;

			// Trigger the loading styling
			view.$videoPager.addClass('is-loading');
			view.$videoPager.attr('disabled', 'true');

			// Call the models video loading function
			view.model.loadMoreVideos().then(function() {

				// When the request returns, remove the loading styling
				view.$videoPager.removeClass('is-loading');
				view.$videoPager.removeAttr('disabled');

				// Disable the button if we've hit the page limit
				if (view.model.pagesLoaded >= 3) {
					view.$videoPager.addClass('is-disabled');
					view.$videoPager.attr('disabled', 'true');
					view.$el.off('click', '#video_pager');
				}
			});
			
		},


		render: function() {
			this.$image.empty();
			this.$title.empty();

			this.$image.append($('<img src="' + this.model.attributes.logo + '"/>'));
			this.$title.append(this.model.attributes.name);
		},


		initialize: function() {
			this.infoContainer = this.$('#channel_info');
			this.$image = this.$('#channel_image');
			this.$title = this.$('#channel_title');
			this.$links = this.$('#channel_links');
			this.$stats = this.$('#channel_stats');
			this.$videoPager = this.$('#video_pager');

			this.loadNextPage();
			this.render();


			this.VideoListView = new app.VideoListView({ collection: this.model.Videos});

		}


	});








	// App View
	app.AppView = Backbone.View.extend({

		el: '#vimeo_sample',


		events: {
			'change #channel_select': 'viewChannel'
		},


		viewChannel: function() {

			app.OpenChannel = new app.Channel({
				'channel_identifier': this.$channelSelect.val()
			});

			app.OpenChannel.fetch().then(function() {
				app.OpenChannelView = new app.ChannelView({ model: app.OpenChannel });
			});

		},


		render: function() {
			var appView = this;

			app.ChannelList.forEach(function(identifier) {
				var newOption = $('<option>');

				newOption.val(identifier).append(identifier);
				appView.$channelSelect.append(newOption);
			});


			appView.viewChannel();

		},

		initialize: function() {
			this.$channelSelect = this.$('#channel_select');

			this.render();

		}

	});

});