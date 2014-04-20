class App::TeammatesController < ApplicationController
	before_filter :authenticate_user!

	def index
		@users = current_user.teammates
	end

end
