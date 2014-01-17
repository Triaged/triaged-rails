class Services::CrashlyticsController < ServiceController
	respond_to :json

	def webhook
		event_type = (params[:event] == "verification") ?  "verification" : params[:payload_type]

		# Ensure company exists
		Company.find(params[:company_id])
		

		payload = {event: params[:payload], company_id: params[:company_id], event_type: event_type}
		Crashlytics::WebhookService.new.instrument(payload)
		head :ok
	# rescue StandardError
		# head :unauthorized
	end
end
