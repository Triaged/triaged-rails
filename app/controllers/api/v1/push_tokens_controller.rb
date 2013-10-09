class Api::V1::PushTokensController < API::BaseController

	def create
		current_user.push_tokens.create(push_params)
		render head :ok
	end

private

	def push_params
		params[:push_token].permit(:service, :token)
	end

end
