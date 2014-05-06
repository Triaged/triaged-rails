class ProvidersController < WebController
	before_filter :set_provider, :except => [:index]
	before_filter :check_connected, :only => [:show]


	def index
		@providers = Provider.active
	end

	def show
		@provider_account = current_user.company.provider_accounts.default_provider_account_for(Provider.named "github")
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

		if @provider.oauth
			session[:app_id] = @app.id
			redirect_to user_omniauth_authorize_path(@provider.oauth_path)
		else
			redirect_to webhook_settings_app_provider_path
		end
	end
end
