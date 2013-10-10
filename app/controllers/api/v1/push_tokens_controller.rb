class Api::V1::PushTokensController < API::BaseController

	def create
		current_user.push_tokens.find_or_create_by(service: push_params[:service], token: push_params[:token])
		render :json => 'ok', :status => 201
	end

	def reset_count
		push_tokens = current_user.push_tokens.where(service: push_params[:service])
		push_tokens.each {|push_token| push_token.update_attribute(:count, 0)}
		Rails.logger.info push_tokens.inspect
		render :json => 'ok', :status => 201
	end

private

	def push_params
		params[:push_token].permit(:service, :token)
	end

end
