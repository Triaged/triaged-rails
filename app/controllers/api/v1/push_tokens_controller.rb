class Api::V1::PushTokensController < API::BaseController

	def create
		current_user.push_tokens.find_or_create_by(service: push_params[:service], token: push_params[:token])
		render head :ok
	end

private

	def push_params
		params[:push_token].permit(:service, :token)
	end

end
