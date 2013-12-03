class Services::CrashlyticsController < ServiceController
	respond_to :json

	def webhook
		payload = {event: params[:payload], company_id: params[:company_id]}
		Crashlytics::WebhookService.new.instrument(payload)
		head :ok
	# rescue StandardError
		# head :unauthorized
	end
end
