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
    render json: @user, serializer: AccountSerializer
  end

  def create
    @user.update(user_params)
    render json: @user, serializer: AccountSerializer
  end

  def resend_verify_email
  	VerifyEmail.new(@user.id).deliver!
  end

  def welcome_complete
  	render :json => 'ok', :status => 200
  end

private

	def set_user
		@user = current_user
	end

	def user_params
    params[:user].permit(:name, :avatar, :push_enabled)
  end

end