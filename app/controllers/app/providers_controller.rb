class App::ProvidersController < ApplicationController
	before_filter :authenticate_user!
	before_filter :set_provider, :except => [:index]
	before_filter :check_connected, :only => [:show]


	def index
		@providers = Provider.active
	end

	def show
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
		return if @provider.connected?(current_user.company)

		if @provider.oauth
			redirect_to user_omniauth_authorize_path(@provider.oauth_path)
		else
			redirect_to webhook_settings_app_provider_path
		end
	end

end
