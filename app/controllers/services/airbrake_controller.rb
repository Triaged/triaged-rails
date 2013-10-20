class Services::AirbrakeController < ServiceController

	def webhook
		# ensure company exists, if not, degrade gracefully
		company = Company.find(params[:id])
		payload = {event: params, company_id: company.id}
		Airbrake::WebhookService.new.instrument(payload)
		head :ok
	# rescue StandardError
		# head :unauthorized
	end
end
