class WebController < ApplicationController
	before_action :authenticate_user!
	before_action :set_company
	before_action :set_app


	def set_company
		@company = current_user.company
	end

	def set_app
		@app = @company.company_apps.find(params[:app_id]) if params[:app_id]
	end


end
