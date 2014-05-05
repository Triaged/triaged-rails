class Api::V1::ProviderPropertiesController < API::BaseController
	before_action :set_provider
	before_action :set_provider_property, :except => :index

	def index
		@properties = @app.connected_provider_account.provider_properties
		respond_with @properties
	end

	def ignore
		current_user.ignore @provider_property
		render json: current_user, serializer: AccountSerializer
	end

	def follow
		current_user.stop_ignoring @provider_property
		render json: current_user, serializer: AccountSerializer
	end

private
	def set_provider
		@provider = Provider.find(params[:provider_id])
	end

  def set_provider_property
  	@provider_account = ProviderAccount.find(params[:provider_account_id])
  	@provider_property = @provider_account.provider_properties.find(params[:id])
  end


end
