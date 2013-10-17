class OmniauthCallbacksController < Devise::OmniauthCallbacksController
	
	def all
		user = current_user.save_omniauth(request.env["omniauth.auth"])
    flash.notice = "Added Github"
    redirect_to account_path
  end

  def google_oauth2
		params = request.env["omniauth.auth"]
		logger.info params
		user = current_user.save_omniauth("google_analytics", params['uid'], params['credentials']['token'], params['credentials']['refresh_token'])
    redirect_to oauth_complete_path
  end
	

	def github
		params = request.env["omniauth.auth"]
		user = current_user.save_omniauth("github", params['uid'], params['credentials']['token'])
    redirect_to org_list_services_github(:subdomain => user.company)
  end

	def stripe_connect
		params = request.env["omniauth.auth"]
    user = current_user.save_omniauth("stripe", params['uid'], params['credentials']['token'])
    redirect_to oauth_complete_path
  end

end