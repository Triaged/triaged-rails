module Common::WebhookService

	# Responsible for receiving webhook data, 
	# packaging it into an internal event, 
	# sending the event for feed processing

	def self.build_event_and_add_to_feeds event_class, payload
		company = Company.find(payload[:company_id])
		event = event_class.build_from_webhook payload[:event].to_properties
	
		Common::FeedService.add_to_feed event, company
	end
end