class Common::WebhookService


	# Responsible for receiving webhook data, 
	# packaging it into an internal event, 
	# sending the event for feed processing

	def self.build_event_and_add_to_feeds event_class, payload
		# Resque.enqueue(WebhookService, event_class, payload)

		# Hack to fix dump moped id
		payload[:company_id] = payload[:company_id].to_s
		
		AsyncWebhookService.perform_async(event_class.to_s, payload)
	end
end