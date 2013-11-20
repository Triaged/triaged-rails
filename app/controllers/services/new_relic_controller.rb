class Services::NewRelicController < ServiceController

	def webhook
		payload = {event: params, company_id: params[:company_id], external_id: request.headers['X-Newrelic-Transaction']}
		NewRelic::WebhookService.new.instrument(payload)
		head :ok
	# rescue StandardError
		# head :unauthorized
	end
end
