class Services::ZapierController < ServiceController
	respond_to :json

	def webhook
		payload = {event: params[:zapier], company_id: params[:api_key]}
		Zapier::WebhookService.new.instrument(payload)
		
		head :ok
	# rescue StandardError
	# 	# head :unauthorized
	end

end
