class Services::KilnController < ServiceController

	def create
		event = JSON.parse(params["payload"])
		payload = {event: params, company_id: request.subdomain}
		Kiln::WebhookService.new.instrument payload
		head :ok
	# rescue StandardError
	# 	# head :unauthorized
	end

end