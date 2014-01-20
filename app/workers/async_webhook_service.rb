class AsyncWebhookService
	include Sidekiq::Worker

	def perform event_class, payload
		Rails.logger.info "Building event for #{event_class}"
		
		payload = RecursiveOpenStruct.new(payload)
		company = Company.find(payload.company_id)

		json_event = event_class.constantize.build_from_webhook payload.event,company

		if json_event # event will be nil if validation failed

			parsed_event = JSON.parse(json_event)

			# Remove author json from event
			author_service = Common::AuthorService.new(parsed_event.delete("author"), company)

			event_type = "Cards::#{parsed_event.delete("type").camelize}"
			event = event_type.constantize.new(parsed_event)

			# Set user if one exists
			event.user = author_service.user if author_service.user?
			
			# generic after init hook
			event.after_build_hook company

			# Set timestamp if we don't already have one
			event.timestamp = payload[:timestamp] unless event.timestamp

			# ensure the company knows this provider is connected
			Common::ProviderConnection.ensure_connected(company, event.provider)
		
			# add event to company feed
			Common::FeedService.add_to_feed event, company
		end
	end
end

# if parsed_event.delete("type") == "event"
# 				# create event from json
# 				event = Cards::Event.new parsed_event
# 			else
# 				event = Cards::EventSet.new parsed_event
# 			end