class AsyncWebhookService
	include Sidekiq::Worker

	def perform event_class_string, payload
		Rails.logger.info "Building event for #{event_class_string}"
		
		event_class = event_class_string.constantize

		payload = RecursiveOpenStruct.new(payload)
		company = Company.find(payload.company_id)
		
		json_event = event_class.build_from_webhook payload.event,company

		if json_event # event will be nil if validation failed

			parsed_event = JSON.parse(json_event)

			# Remove author json from event
			author_service = Common::AuthorService.new(parsed_event.delete("author"), company)

			# build card
			card = Cards::Event.new(parsed_event)

			# Set user if one exists
			card.user = author_service.user if author_service.user?

			# generic after init hook
			card.after_build_hook company

			# add event to company feed
			Common::FeedService.add_to_feed card, company
		end
	end
end