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

			# Build Provider, if needed
			provider = parsed_event["provider"] ? build_provider(parsed_event.delete("provider")) : Provider.named(parsed_event["provider_name"])

			# build card
			card = Cards::Event.new(parsed_event)

			# Set provider
			card.provider = provider

			# Set user if one exists
			card.user = author_service.user if author_service.user?

			# generic after init hook
			card.after_build_hook company, payload

			# add event to company feed
			Common::FeedService.add_to_feed card, company
		end
	end


	def build_provider provider_dict

		provider = Provider.find_or_initialize_by name: provider_dict["name"]

		if provider.new_record?
			provider.remote_large_icon_url = provider_dict["large_icon"]
			provider.remote_small_icon_url = provider_dict["small_icon"]
			provider.title = provider_dict["name"].capitalize
			provider.short_title = provider_dict["name"].capitalize
			provider.zapier = true
			provider.save
		end

		provider
	end

end