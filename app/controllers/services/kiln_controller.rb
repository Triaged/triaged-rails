class Services::KilnController < ServiceController

	def webhook
		company = Company.find(params[:id])
		event = JSON.parse(params["payload"])
		payload = {event: event, company_id: company}
		Kiln::WebhookService.new.instrument(payload)
		head :ok
	# rescue StandardError
	# 	# head :unauthorized
	end

end