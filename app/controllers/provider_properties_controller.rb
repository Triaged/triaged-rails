class ProviderPropertiesController < WebController
	before_action :set_provider

	def index
		@provider_account = @app.provider_account_for(@provider)
		@properties = @provider_account.available_properties
	end

private

	

	def set_provider
		@provider = Provider.find(params[:provider_id])
	end
end
