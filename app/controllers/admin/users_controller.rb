class Admin::UsersController < AdminsController

	def index
    @users = User.all
  end

  # GET /admin/providers/1
  def show
  	@user = User.find(params[:id])
  end


end
