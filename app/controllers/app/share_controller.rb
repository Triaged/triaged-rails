class App::ShareController < ApplicationController

	respond_to :html
	before_action :set_share

	def show
		respond_with @share
	end

	private

	def set_share
		@share = Share.find(params[:id])
	end


end
