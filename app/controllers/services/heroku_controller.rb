class Services::HerokuController < ServiceController

	def webhook
		company = Company.find(params[:id])
		payload = {event: params, company_id: company.id}
		Heroku::WebhookService.new.instrument(payload)
		head :ok
	# rescue StandardError
		# head :unauthorized
	end

end
