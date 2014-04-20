class App::ProvidersController < ApplicationController
	before_filter :authenticate_user!, :except => [:authenticate_for_oauth]


	def index
		@providers = Provider.active
	end


	def authenticate_for_oauth
		provider = params[:provider]
  	redirect_to user_omniauth_authorize_path(provider)
  end

end
