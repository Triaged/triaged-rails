class Services::CrashlyticsController < ServiceController
	respond_to :json

	def webhook
		event_type = params[:event]

		# If verification, ensure company exists
		if (event_type == "verification")
			Company.find(params[:company_id])
		end

		payload = {event: params[:payload], company_id: params[:company_id], event_type: event_type}
		Crashlytics::WebhookService.new.instrument(payload)
		head :ok
	# rescue StandardError
		# head :unauthorized
	end
end
