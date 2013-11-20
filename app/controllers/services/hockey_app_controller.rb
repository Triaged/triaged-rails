class Services::HockeyAppController < ServiceController 

	def webhook
		payload = {event: params, company_id: params[:company_id]}
		HockeyApp::WebhookService.new.instrument(payload)
		head :ok
	# rescue StandardError
		# head :unauthorized
	end


end