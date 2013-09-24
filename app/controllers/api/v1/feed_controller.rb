class Api::V1::FeedController < API::BaseController

	def index
		@feed = current_user.feed
		respond_with @feed
	end

	def mock
		#@response = { "feed" => [{"feed_item" => {"title" => "This is a title1", "body" => "this is a body1" }}, {"feed_item" => {"title" => "This is a title2", "body" => "this is a body2" }}]}
		@response = { "feed" => [{"title" => "This is a title1", "body" => "this is a body1" }, {"title" => "This is a title2", "body" => "this is a body2" }]}
		respond_with @response.to_json
	end

	def show
		@item = current_user.company.feed_items.find(params[:id])
		respond_with @item
	end
end
