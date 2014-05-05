class TeamsController < WebController

	def show
		@users = current_user.teammates
	end

end
