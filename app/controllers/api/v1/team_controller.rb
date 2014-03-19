class Api::V1::TeamController < API::BaseController
	before_action :set_user, :except => :index

	def index
		@team = current_company.users
		respond_with @team
	end

	def feed
		@feed_items = @user.authored_feed_items.includes(:messages, :author, :provider).limit(100).order(created_at: :desc)
		respond_with @feed_items
	end
	
	# def ignore
	# 	current_user.ignore @provider
	# 	render json: current_user, serializer: AccountSerializer
	# end

	# def follow
	# 	current_user.stop_ignoring @provider
	# 	render json: current_user, serializer: AccountSerializer
	# end

	

private
  def set_user
  	@user = current_company.users.find(params[:id])
  end

end
