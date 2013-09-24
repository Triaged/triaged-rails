class Services::NewRelicController < ServiceController

	def create
		payload = {event: params, company_id: request.subdomain, external_id: request.headers['X-Newrelic-Transaction']}
		NewRelic::WebhookService.new.instrument(payload)
		head :ok
	# rescue StandardError
		# head :unauthorized
	end
end
