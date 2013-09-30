class Services::StatusPageController < ApplicationController

	def service
		service = params[:service]
		payload = {event: params, service: service, event_type: "incident"}
		StatusPage::WebhookService.new.instrument payload
		head :ok
	# rescue StandardError
	# 	# head :unauthorized
	end

end
