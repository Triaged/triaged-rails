class Services::SentryController < ServiceController
	respond_to :json

	def webhook
		company = Company.find(params[:id])
		payload = {event: params, company_id: company.id}
		Sentry::WebhookService.new.instrument(payload)
		head :ok
	# rescue StandardError
		# head :unauthorized
	end
end
