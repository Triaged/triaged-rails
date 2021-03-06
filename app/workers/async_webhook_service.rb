class AsyncWebhookService
	include Sidekiq::Worker

	def perform event_class, payload
		Rails.logger.info "Building event for #{event_class}"
		
		payload = RecursiveOpenStruct.new(payload)
		event = event_class.constantize.build_from_webhook payload.event

		if event # event will be nil if validation failed
			company = Company.find(payload.company_id)
			
			# generic after init hook
			event.after_build_hook company

			# Set timestamp if we don't already have one
			event.timestamp = payload[:timestamp]

			# ensure the company knows this provider is connected
			Common::ProviderConnection.ensure_connected(company, event.provider_from_name)
		
			# add event to company feed
			Common::FeedService.add_to_feed event, company
		end
	end
end