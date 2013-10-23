class Common::WebhookService


	# Responsible for receiving webhook data, 
	# packaging it into an internal event, 
	# sending the event for feed processing

	def self.build_event_and_add_to_feeds event_class, payload
		Resque.enqueue(WebhookService, event_class, payload)
	end
end