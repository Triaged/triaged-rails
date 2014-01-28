class Api::V1::ProvidersController < API::BaseController
	before_action :set_provider, :except => [:index, :connected]

	def index
		@providers = Provider.active
		respond_with @providers
	end

	def connected
		@providers = current_company.connected_providers.collect {|connected| connected.provider }
		respond_with @providers
	end

	def feed
		@feed_items = current_company.feed_items.where(provider: @provider).desc(:created_at).limit(100)
		respond_with @feed_items
	end
	
	def ignore
		current_user.ignore @provider
		render json: current_user, serializer: AccountSerializer
	end

	def follow
		current_user.stop_ignoring @provider
		render json: current_user, serializer: AccountSerializer
	end

	def email_connect_instructions
		WebhookInstructions.perform_async(current_user.id.to_s, @provider.id.to_s)
		render :json => 'ok', :status => 201
	end

private
  def set_provider
  	@provider = Provider.find(params[:id])
  end
end
