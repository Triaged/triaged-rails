class Api::V1::ProvidersController < API::BaseController
	before_action :set_provider
	
	def ignore
		current_user.ignore @provider
		render json: current_user, serializer: AccountSerializer
	end

	def follow
		current_user.stop_ignoring @provider
		render json: current_user, serializer: AccountSerializer
	end

	def email_connect_instructions
		WebhookInstructions.new(current_user.id, @provider.id).deliver!
		render :json => 'ok', :status => 201
	end

private
  def set_provider
  	@provider = Provider.find(params[:id])
  end
end
