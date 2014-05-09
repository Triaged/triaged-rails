class OmniauthCallbacksController < Devise::OmniauthCallbacksController
  before_filter :set_app_from_session
	
	def all
		user = current_user.save_omniauth(request.env["omniauth.auth"])
    flash.notice = "Added Github"
    redirect_to account_path
  end

  def google_oauth2
		params = request.env["omniauth.auth"]
		Rails.logger.info params
		result = current_user.save_omniauth("google_analytics", params['uid'], params['credentials']['token'], refresh_token: params['credentials']['refresh_token'])
    redirect_to account_list_google_analytics_path
  end
	
	def github
		params = request.env["omniauth.auth"]
		result = current_user.save_omniauth("github", params['uid'], params['credentials']['token'])
		#redirect_to oauth_complete_path
    redirect_to select_app_provider_accounts_path(@app, Provider.named("github"))
  end

  def stripe_connect
		params = request.env["omniauth.auth"]
    result = current_user.save_omniauth("stripe", params['uid'], params['credentials']['token'])
    redirect_to oauth_complete_path
  end

  def trello
    params = request.env["omniauth.auth"]
    result = current_user.save_omniauth("trello", params['uid'], params['credentials']['token'], token_secret: params['credentials']['secret'])
    redirect_to oauth_complete_path
  end

  def dropbox_oauth2
		params = request.env["omniauth.auth"]
    result = current_user.save_omniauth("dropbox", params['uid'], params['credentials']['token'])
    redirect_to oauth_complete_path
  end

  def appFigures
		params = request.env["omniauth.auth"]
		result = current_user.save_omniauth("appfigures", params['uid'], params['credentials']['token'], refresh_token: params['credentials']['secret'])
    redirect_to oauth_complete_path
  end

  def heroku
    params = request.env["omniauth.auth"]
    result = current_user.save_omniauth("heroku", params['uid'], params['credentials']['token'], refresh_token: params['credentials']['refresh_token'])
    redirect_to oauth_complete_path

  end

private

  def set_app_from_session
    @app = CompanyApp.find(session[:app_id])
  end

end