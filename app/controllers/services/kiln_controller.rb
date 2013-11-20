class Services::KilnController < ServiceController

	def webhook
		event = JSON.parse(params["payload"])
		payload = {event: event, company_id: params[:company_id] }
		Kiln::WebhookService.new.instrument(payload)
		head :ok
	# rescue StandardError
	# 	# head :unauthorized
	end

end