class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
	protect_from_forgery with: :exception
	before_filter :configure_permitted_parameters, if: :devise_controller?

  def authenticate_user_from_token!
  	logger.info "Authenticating from token"
  	user_token = request.headers["HTTP_AUTHORIZATION"].presence
  	logger.info user_token
    user = user_token && User.find_by(authentication_token: user_token)
    sign_in user if user
  rescue
  	# find_by fails with an invalid token
  end

  def check_for_mobile
    prepare_for_mobile if mobile_device?
  end

  def prepare_for_mobile
    prepend_view_path Rails.root + 'app' + 'views_mobile'
  end

  def mobile_device?
      # Season this regexp to taste. I prefer to treat iPad as non-mobile.
       (request.user_agent =~ /Mobile|webOS/) && (request.user_agent !~ /iPad/)
  end
  helper_method :mobile_device?

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.for(:sign_up) << :name
  end
end
