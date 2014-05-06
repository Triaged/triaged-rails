class ProviderPropertiesController < WebController
	before_action :set_provider

	def index
		@properties = @app.provider_account_for(@provider).provider_properties
	end

private

	

	def set_provider
		@provider = Provider.find(params[:provider_id])
	end
end
