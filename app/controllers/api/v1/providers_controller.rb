class Api::V1::ProvidersController < API::BaseController
	before_action :set_provider
	
	def follow
		current_user.follow @provider
		render :json => 'ok', :status => 201
	end

	def unfollow
		current_user.unfollow @provider
		render :json => 'ok', :status => 201
	end

private
  def set_provider
  	@provider = Provider.find(params[:id])
  end
end
