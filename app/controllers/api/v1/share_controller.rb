class Api::V1::ShareController <  API::BaseController
	before_action :set_feed_item

	def create
		@feed_item.shares.create(share_params.merge(user: current_user))
		render :json => 'ok', :status => 201
	end

private

	def set_feed_item
    @feed_item = current_company.feed_items.find(params[:feed_id])
	end

	def share_params
		params[:share].permit(:recipient_email)
	end
end
