class OmniauthCallbacksController < Devise::OmniauthCallbacksController
	
	def all
		user = current_user.save_omniauth(request.env["omniauth.auth"])
    flash.notice = "Added Github"
    redirect_to account_path
  end
	

	def github
		params = request.env["omniauth.auth"]
		logger.info params.inspect
		user = current_user.save_omniauth("github", params['uid'], params['credentials']['token'])
    flash.notice = "Added Stripe"
   	redirect_to oauth_complete_path
  end

	def stripe_connect
		params = request.env["omniauth.auth"]
    user = current_user.save_omniauth("stripe", params['uid'], params['credentials']['token'])
    flash.notice = "Added Stripe"
    redirect_to oauth_complete_path
  end

end