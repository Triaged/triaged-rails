class Services::SentryController < ServiceController
	respond_to :json

	def create
		payload = {event: params, company_id: request.subdomain}
		Sentry::WebhookService.new.instrument(payload)
		head :ok
	# rescue StandardError
		# head :unauthorized
	end
end
