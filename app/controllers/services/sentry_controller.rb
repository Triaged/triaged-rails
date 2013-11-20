class Services::SentryController < ServiceController
	respond_to :json

	def webhook
		payload = {event: params, company_id: params[:company_id]}
		Sentry::WebhookService.new.instrument(payload)
		head :ok
	# rescue StandardError
		# head :unauthorized
	end
end
