class App::ProvidersController < ApplicationController


	def authenticate_for_oauth
		provider = params[:provider]
  	redirect_to user_omniauth_authorize_path(provider)
  end

end
