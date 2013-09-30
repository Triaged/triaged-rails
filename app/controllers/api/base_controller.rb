class API::BaseController < ApplicationController
  respond_to :json
  protect_from_forgery with: :null_session
  before_filter :authenticate_user_from_token!, :except => [:page_not_found]
  before_filter :authenticate_user!
  before_filter :current_company
  # rescue_from Brainstem::SearchUnavailableError, :with => :search_unavailable
  # rescue_from ActiveRecord::RecordNotFound,
  #             ActionController::RoutingError,
  #             ::AbstractController::ActionNotFound, :with => :page_not_found

  protected

  def current_company
  	current_user.company
  end

  def page_not_found
    render :json => { :errors => ['Page not found'] }, :status => 404
  end

  def search_unavailable
    render :json => { :errors => ['Search is currently unavailable'] }, :status => 503
  end
end