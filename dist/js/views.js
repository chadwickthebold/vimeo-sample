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


		events: {
			'click .video-pager' : 'loadNextPage',
			'click .show-details' : 'showInfoSection'
		},

		showInfoSection: function() {
			this.$detailsToggle.toggleClass('details-shown details-hidden');
			this.$detailsSection.toggleClass('is-hidden');
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
				if (view.model.get('pagesLoaded') >= 3) {
					view.$videoPager.addClass('is-disabled');
					view.$videoPager.attr('disabled', 'true');
					view.$el.off('click', '.video-pager');
				}
			});
			
		},


		render: function() {

			this.$image.empty();
			this.$title.empty();

			this.$image.append($('<img src="' + this.model.attributes.logo + '"/>'));
			this.$title.append(this.model.attributes.name);

			this.$rssLink.attr('href', this.model.get('rss'));
			this.$description.text(this.model.get('description'));
			this.$createdDate.text(moment(this.model.get('created_on')).format("MMM Do YY"));
			this.$creator.attr('href', this.model.get('creator_url'));
			this.$creator.text(this.model.get('creator_display_name'));
			this.$vids.text(this.model.get('total_videos'));
			this.$subs.text(this.model.get('total_subscribers'));
		},


		initialize: function() {
			this.infoContainer = this.$('.channel_info');
			this.$image_area = this.$('.channel-image');
			this.$image = this.$('.logo-container');
			this.$title = this.$('.channel-title');
			this.$vids = this.$('.channel-vids');
			this.$subs = this.$('.channel-subscribers');
			this.$detailsToggle = this.$('.show-details');
			this.$videoPager = this.$('.video-pager');
			this.$detailsSection = this.$('.channel-details');
			this.$rssLink = this.$('.channel-rss');
			this.$description = this.$('.channel-description');
			this.$createdDate = this.$('.channel-createdDate');
			this.$creator = this.$('.channel-creator');

			this.loadNextPage();
			this.render();


			this.VideoListView = new app.VideoListView({ collection: this.model.Videos});

		}


	});








	// App View
	app.AppView = Backbone.View.extend({

		el: '#vimeo_sample',


		events: {
			'change #vimeo_channel_select': 'viewChannel'
		}, 


		viewChannel: function() {

			if (app.OpenChannel && app.OpenChannelView) {
				app.OpenChannelView.undelegateEvents(); 
			}

			app.OpenChannel = new app.Channel({
				'channel_identifier': this.$channelSelect.val()
			});

			app.OpenChannel.fetch().then(function() {
				app.OpenChannelView = new app.ChannelView({ el : '#vimeo_channel_browser',model: app.OpenChannel });
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
			this.$channelSelect = this.$('#vimeo_channel_select');

			this.render();

		}

	});

});