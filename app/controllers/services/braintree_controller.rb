class Services::BraintreeController < ServiceController 

	def show
		@response = Braintree::WebhookNotification.verify(params[:bt_challenge])
		respond_with @response
	end

	# Can't use subdomains for stripe
	def webhook
		payload = {event: params, company_id: params[:company_id]}
		Braintree::WebhookService.new.instrument(payload)
		head :ok
	# rescue StandardError
		# head :unauthorized
	end

end