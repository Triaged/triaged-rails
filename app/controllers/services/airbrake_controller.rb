class Services::AirbrakeController < ServiceController

	def create
		payload = {event: params, company_id: request.subdomain}
		Airbrake::WebhookService.new.instrument(payload)
		head :ok
	# rescue StandardError
		# head :unauthorized
	end
end
