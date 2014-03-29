class Api::V1::ThumbsupController < API::BaseController
	before_action :set_feed_item
	

  # GET /api/v1/messages
  def index
    @messages = @feed_item.thumbsups.all
    respond_with @messages
  end

  def toggle
    @thumbsup = Common::MessageService.toggle_thumbsup(@feed_item, thumbsup_params.merge(user_id: current_user.id))
    respond_with @thumbsup, :location => api_v1_feed_thumbsup_path(@feed_item, @thumbsup)
  end

  
  private
    def set_feed_item
    	@feed_item = current_company.feed_items.find(params[:feed_id])
    end

    # Only allow a trusted parameter "white list" through.
    def thumbsup_params
      params[:thumbsup].permit!
    end
end
