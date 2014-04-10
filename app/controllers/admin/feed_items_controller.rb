class Admin::FeedItemsController < AdminsController

	def index
    @feed_items = FeedItem.limit(100)
  end

  # GET /admin/providers/1
  def show
  	@feed_item = FeedItem.find(params[:id])
  end

end
