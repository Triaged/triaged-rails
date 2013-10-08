class Api::V1::FeedController < API::BaseController

	def index
		@feed = current_user.feed(params[:min_id], params[:max_id])
		respond_with @feed
	end

	def mock
		#@response = { "feed" => [{"feed_item" => {"title" => "This is a title1", "body" => "this is a body1" }}, {"feed_item" => {"title" => "This is a title2", "body" => "this is a body2" }}]}
		@response = mock_json
		respond_with @response.to_json
	end

	def show
		@item = current_user.company.feed_items.find(params[:id])
		respond_with @item
	end

	def view
		@item = current_user.company.feed_items.find(params[:id])
		redirect_to @item.html_url
	end

	def mock_json
		[
			{
				"id" => "523a486b43c9eaf40d00000d",
				"html_url" => "www.test.com"
			},
			{
				"id" => "523a486b43c9eaf40d000001",
				"html_url" => "www.google.com"
			}
		]
		# {
		#   "feed" => [
		#     {
		#       "provider" => "github",
		#       "event" => "issue_opened",
		#       "id" => "523a486b43c9eaf40d00000d",
		#       "title" => "hotstuff",
		#       "opened_by_name" => "CharlieWhite",
		#       "assigned_to_name" => "CharlieWhite",
		#       "body" => "Blah Blah Blah",
		#       "html_url" => "https:\/\/github.com\/CharlieWhite\/bluenote-rails\/issues\/6"
		#     },
		#     {
		#       "provider" => "sentry",
		#       "event" => "exception",
		#       "id" => "523a66be43c9ea68b5000003",
		#       "project" => "project-slug",
		#       "message" => "Thisisanexample",
		#       "culprit" => "foo.bar.baz",
		#       "logger" => "root",
		#       "level" => "error"
		#     },
		#     {
		#       "provider" => "stripe",
		#       "event" => "charge_succeeded",
		#       "id" => "52423acc43c9ea9df0000001",
		#       "amount" => 2000
		#     }
		#   ]
		# }
	end

end


