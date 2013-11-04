class Api::V1::AccountsController < API::BaseController
	before_action :set_user


	def show
		render json: @user, serializer: AccountSerializer
	end

	def team
		@teammates = @user.teammates
		respond_with @teammates
	end

	def update
    @user.update(user_params)
    respond_with @user
  end

  def create
    @user.update(user_params)
    respond_with @user
  end

private

	def set_user
		@user = current_user
	end

	def user_params
    params[:user].permit(:name, :avatar, :push_disabled)
  end

end