class App::TeamController < ApplicationController
	before_filter :authenticate_user!

	def index
		@users = current_user.team
	end
	
end
