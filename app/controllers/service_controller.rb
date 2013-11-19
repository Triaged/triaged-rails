class ServiceController < ApplicationController
	respond_to :json, :html, :json

	protect_from_forgery except: :create

	before_action :authenticate_user_from_token!, :only => :authenticate_for_oauth
	before_action :authenticate_user!, :only => :authenticate_for_oauth

	# Handle users clicking on webhook urls from the browser
	def index
		redirect_to root_path
	end
	

	def authenticate_for_oauth
		provider = params[:provider]
  	redirect_to user_omniauth_authorize_path(provider)
  end

  def oauth_complete
  	render :json => { "success" => "true" }
  end

  def oauth_failure
  	error = params[:error] || "oAuth Failed"
  	render :json => { "success" => "false", "error" => error }
  end
	
end
