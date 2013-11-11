class Api::V1::RegistrationsController < API::BaseController

	skip_before_filter :authenticate_user!
	
	def create
	 user = User.new(registration_params)
		if user.save
			render json: @user, serializer: AccountSerializer
			return
		else
			warden.custom_failure!
			render :json=> error_message(user.errors.first), :status=>422
		end
	end

private
	def registration_params
    params[:registration].permit(:email, :password, :password_confirmation, :name)
  end

  def error_message message_hash
  	Rails.logger.info message_hash
  end
end