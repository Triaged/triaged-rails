class Services::NewRelicController < ServiceController

	def create
		company = Company.find(params[:id])
		payload = {event: params, company_id: company.id, external_id: request.headers['X-Newrelic-Transaction']}
		NewRelic::WebhookService.new.instrument(payload)
		head :ok
	# rescue StandardError
		# head :unauthorized
	end
end
