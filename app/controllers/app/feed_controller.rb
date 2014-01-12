class App::FeedController < ApplicationController

	respond_to :html

	def index
		@feed_items = FeedItem.all
		respond_with @feed
	end
end
