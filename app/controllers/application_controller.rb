class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
	protect_from_forgery with: :exception
	before_filter :configure_permitted_parameters, if: :devise_controller?

  def authenticate_user_from_token!
  	logger.info "Authenticating from token"
  	user_token = request.headers["HTTP_AUTHORIZATION"].presence
  	logger.info user_token
    user  = user_token && User.find_by(authentication_token: user_token)
    if user
      # Notice we are passing store false, so the user is not
      # actually stored in the session and a token is needed
      # for every request. If you want the token to work as a
      # sign in token, you can simply remove store: false.
      sign_in user #, store: false
    end
  rescue
  	# find_by fails with an invalid token
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.for(:sign_up) << :name
  end
end
