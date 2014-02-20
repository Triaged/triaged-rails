class App::FeedItemsController < ApplicationController
	before_action :authenticate_user!
	
	respond_to :html
	before_action :set_feed_item

	def show
		respond_with @feed_item
	end

	private

	def set_feed_item
		@feed_item = FeedItem.find(params[:id])
	end


end