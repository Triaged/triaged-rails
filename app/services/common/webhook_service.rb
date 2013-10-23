class Common::WebhookService

	# Responsible for receiving webhook data, 
	# packaging it into an internal event, 
	# sending the event for feed processing

	def perform event_class, payload
		Rails.logger.info "Building event for #{event_class}"
		company = Company.find(payload[:company_id])
		event = event_class.build_from_webhook payload[:event].to_properties

		# generic after init hook
		event.after_build_hook company

		# ensure the company knows this provider is connected
		Common::ProviderConnection.ensure_connected(company, event.provider)
	
		# add event to company feed
		Common::FeedService.add_to_feed event, company
	end

	def self.build_event_and_add_to_feeds event_class, payload
		Common::WebhookService.perform_async(event_class, payload)
	end
end