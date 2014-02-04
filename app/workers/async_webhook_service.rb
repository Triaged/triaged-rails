class AsyncWebhookService
	include Sidekiq::Worker

	def perform event_class_string, payload
		Rails.logger.info "Building event for #{event_class_string}"
		
		event_class = event_class_string.constantize

		payload = RecursiveOpenStruct.new(payload)
		company = Company.find(payload.company_id)
		
		json_event = event_class.build_from_webhook payload.event,company

		if json_event # event will be nil if validation failed

			event_hash = JSON.parse(json_event)

			event_hash = set_provider_from_hash(event_hash) # Set Provider
			event_hash = set_author_from_hash(event_hash) # Set Author
			event_hash = set_images_from_hash(event_hash) # Set Images

			# build card
			card = Cards::Event.new(event_hash)

			# generic after init hook
			card.after_build_hook company, payload

			# add event to company feed
			Common::FeedService.add_to_feed card, company
		end
	end


	def set_provider_from_hash event_hash
		provider_dict = event_hash.delete("provider")

		provider = Provider.find_or_initialize_by name: provider_dict["name"].downcase

		if provider.new_record?
			provider.remote_large_icon_url = provider_dict["large_icon"]
			provider.remote_small_icon_url = provider_dict["small_icon"]
			provider.title = provider_dict["name"].capitalize
			provider.short_title = provider_dict["name"].capitalize
			provider.zapier = true
			provider.save
		end

		event_hash[:provider] = provider

		return event_hash
	end

	def set_author_from_hash event_hash
		author_service = Common::AuthorService.new(event_hash.delete("author"), company)
		event_hash[:user] = author_service.user if author_service.user?
		return event_hash
	end

	def set_images_from_hash event_hash
		event_hash[:remote_event_image_url] = event_hash.delete("image_url") if event_hash["image_url"]
		return event_hash
	end

end