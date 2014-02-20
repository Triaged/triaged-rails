class App::FeedController < ApplicationController
	before_action :authenticate_user!

	respond_to :html

	def index
		@feed_items = current_user.feed(params[:min_updated_at], params[:max_updated_at])
		respond_with @feed
	end
end