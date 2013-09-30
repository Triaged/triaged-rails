class Services::KilnController < ServiceController

	def create
		event_type = "push"
		payload = {event: params, company_id: request.subdomain, event_type: event_type}
		Kiln::WebhookService.new.instrument payload
		head :ok
	# rescue StandardError
	# 	# head :unauthorized
	end

end