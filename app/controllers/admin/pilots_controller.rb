class Admin::PilotsController < ApplicationController
	before_action :authenticate_admin!
	

	def index
		@pilots = Pilot.all
	end
end
