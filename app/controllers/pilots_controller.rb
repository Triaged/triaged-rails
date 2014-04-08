class PilotsController < ApplicationController

	def show
	end

	def complete
		Rails.logger.info pilot_params
		Rails.logger.info params[:pilot]
		Pilot.create(pilot_params)
		Common::CaptureEmail.subscribe(pilot_params[:email])
	end

	def pilot_params
		params.require(:pilot).permit!
	end

end
