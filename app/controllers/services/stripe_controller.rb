class Services::StripeController < ServiceController
	respond_to :json

	# Can't use subdomains for stripe
	def create
		Stripe::WebhookService.new.instrument(params)
		head :ok
	# rescue StandardError
		# head :unauthorized
	end
end
