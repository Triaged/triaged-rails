class Services::BraintreeController < ServiceController 

	# Can't use subdomains for stripe
	def webhook
		payload = {event: params, company_id: params[:company_id]}
		Braintree::WebhookService.new.instrument(payload)
		head :ok
	# rescue StandardError
		# head :unauthorized
	end

end