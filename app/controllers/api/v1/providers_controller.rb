class Api::V1::ProvidersController < API::BaseController
	before_action :set_provider
	
	def follow
		current_user.follow @provider
		render json: current_user, serializer: AccountSerializer
	end

	def unfollow
		current_user.unfollow @provider
		render json: current_user, serializer: AccountSerializer
	end

private
  def set_provider
  	@provider = Provider.find(params[:id])
  end
end
