class VerifyController < ApplicationController

	def show
		@user = User.where(id: params[:id], company_validation_token: params[:token]).first
		logger.info @user.inspect
		if @user
			@token =  params[:token]
			@user.update_attribute(:validated_belongs_to_company, true)
		else
			redirect_to(root_path) and return
		end
	end

end
