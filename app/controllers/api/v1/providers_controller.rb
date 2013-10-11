class Api::V1::ProvidersController < ApplicationController
	before_action :set_provider
	
	def follow
		current_user.follow @provider
	end

	def unfollow
		current_user.unfollow @provider
	end

private
  def set_provider
  	@provider = Provider.find(params[:id])
  end
end
