class Api::V1::ProvidersController < API::BaseController
	before_action :set_provider, :except => [:index, :connected]

	def index
		@providers = Provider.active.includes(:provider_account)
		respond_with @providers, each_serializer: ProviderSettingSerializer
	end

	def connected
		@providers = current_company.connected_providers.collect {|connected| connected.provider }
		render json: @providers, each_serializer: ProviderSettingSerializer
	end

	def feed
		@feed_items = @provider.feed_items.includes(:messages, :author, :provider, :thumbsups).limit(100).order(created_at: :desc)
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
