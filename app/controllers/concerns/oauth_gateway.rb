module OauthGateway
	extend ActiveSupport::Concern


	def validate_oauth
		return unless @provider.oauth
		return if current_user.has_authenticated? @provider

		session[:app_id] = @app.id

		respond_to do |format|
    	format.html  { redirect_to user_omniauth_authorize_path(@provider.oauth_path) }
    	format.json  { render :json => { error: "oauthentication required", oauth_url: user_omniauth_authorize_url(@provider.oauth_path) }, :status => 401 }
  	end
		
	end


	# Does this service require oauth Has user connected?


end