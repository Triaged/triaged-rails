class Services::HerokuController < ServiceController

	def create
		payload = {event: params, company_id: request.subdomain}
		Rails.logger.info payload.inspect
		Heroku::WebhookService.new.instrument(payload)
		head :ok
	# rescue StandardError
		# head :unauthorized
	end

end
