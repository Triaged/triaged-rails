class PilotsController < ApplicationController

	def show
	end

	def complete
		Pilot.create(pilot_params)
	end

	def pilot_params
		params.require(:pilot).permit!
	end

end
