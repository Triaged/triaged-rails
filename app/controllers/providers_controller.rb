class ProvidersController < WebController
	include OauthGateway

	before_filter :set_provider, :except => [:index]
	before_filter :validate_oauth, :only => :show
	before_filter :check_connected, :only => [:show]


	def index
		@providers = Provider.active
	end

	def show
		@provider_account = @app.provider_account_for @provider
	end

	def settings
	end

	def webhook_settings

	end


private
	def set_provider
		@provider = Provider.find(params[:id])
	end
	
	def check_connected
		return if @app.connected_to_provider? @provider
		redirect_to webhook_settings_app_provider_path
	end
end
