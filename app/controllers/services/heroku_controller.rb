class Services::HerokuController < ServiceController

	def webhook
		payload = {event: params, company_id: params[:company_id]}
		Heroku::WebhookService.new.instrument(payload)
		head :ok
	# rescue StandardError
		# head :unauthorized
	end

end
