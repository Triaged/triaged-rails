class AccountsController < ApplicationController
	before_action :authenticate_user!
	before_action :set_user, only: [:show, :update, :destroy]

	def show
		@user
	end

	def update
		Rails.logger.info @user.inspect
		@user.save
		Rails.logger.info @user.errors
    @user.update(user_params)
    redirect_to account_path
  end

private

	def set_user
		@user = current_user
	end

	def user_params
    params[:user].permit(:name, :avatar)
  end
end
