class Api::V1::AccountsController < API::BaseController

	def show
		@user = current_user
		render json: @user, serializer: AccountSerializer
	end

end