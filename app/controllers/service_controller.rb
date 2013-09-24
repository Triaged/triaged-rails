class ServiceController < ApplicationController
	respond_to :json, :html, :json

	protect_from_forgery except: :create

	before_action :authenticate_user_from_token!, :only => :authenticate_for_oauth
	before_action :authenticate_user!, :only => :authenticate_for_oauth
	

	def authenticate_for_oauth
		logger.info current_user.inspect
  	provider = params[:provider]
  	redirect_to user_omniauth_authorize_path(provider)
  end

  def oauth_complete
  	render :json => nil
  end
	
end
