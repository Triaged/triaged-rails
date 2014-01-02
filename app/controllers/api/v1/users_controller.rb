class Api::V1::UsersController < API::BaseController
	before_action :set_user, :except => :index

	def index
		@providers = Provider.all
		respond_with @providers
	end

	def feed
		@feed_items = @user.feed_items.desc(:created_at).limit(100)
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
