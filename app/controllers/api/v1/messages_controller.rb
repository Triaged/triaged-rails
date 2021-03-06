class Api::V1::MessagesController < API::BaseController
	before_action :set_feed_item
	before_action :set_message, only: [:show, :update, :destroy]

  # GET /api/v1/messages
  def index
    @messages = @feed_item.messages.all
    respond_with @messages
  end

  # GET /api/v1/messages/1
  def show
  	respond_with @message
  end

  
  # POST /api/v1/messages
  def create
    @message = Common::MessageService.new_message(@feed_item, message_params)
    respond_with @message, :location => api_v1_feed_message_path(@feed_item, @message)
  end

  # PATCH/PUT /api/v1/messages/1
  def update
    @message.update(message_params)
    respond_with @message
  end

  # DELETE /api/v1/messages/1
  def destroy
    @message.destroy
    respond_with @message
  end

  private
    def set_feed_item
    	@feed_item = current_company.feed_items.find(params[:feed_id])
    end

    def set_message
      @message = @feed_item.messages.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def message_params
      params[:message].permit(:author_id, :body, :notify, :uuid, :timestamp)
    end
end
