module Common::FeedService

	def self.add_to_feed(event, company)
		Rails.logger.info event
		if event
			Rails.logger.info "Adding event #{event.provider_name}:#{event.event_name} to company feed: #{company.name}"
			event = company.add_event_to_feed event 
			return true
		else
			return false
		end
	end

	def self.build_event_card(json_event, company)
		Rails.logger.info "building event card"

		return unless json_event # event will be nil if validation failed
		
		event_hash = JSON.parse(json_event)

		event_hash = set_provider_from_hash(event_hash, company) # Set Provider
		event_hash = set_author_from_hash(event_hash, company) # Set Author
		event_hash = set_images_from_hash(event_hash, company) # Set Images

		# build card
		card = Cards::Event.new(event_hash)

		# generic after init hook
		card.after_build_hook company

		# add event to company feed
		Common::FeedService.add_to_feed card, company
	end


	def self.set_provider_from_hash event_hash, company
		provider_dict = event_hash.delete("provider")

		provider = Provider.find_or_initialize_by name: provider_dict["name"].downcase

		if provider.new_record?
			provider.remote_large_icon_url = provider_dict["large_icon"]
			provider.remote_small_icon_url = provider_dict["small_icon"]
			provider.title = provider_dict["name"].capitalize
			provider.short_title = provider_dict["name"].capitalize
			provider.zapier = true
			provider.active = true
			provider.save
		end

		event_hash[:provider] = provider

		return event_hash
	end

	def self.set_author_from_hash event_hash, company
		author_service = Common::AuthorService.new(event_hash.delete("author"), company)
		event_hash[:user] = author_service.user if author_service.user?
		return event_hash
	end

	def self.set_images_from_hash event_hash, company
		event_hash[:remote_event_image_url] = event_hash.delete("image_url") if event_hash["image_url"]
		return event_hash
	end

end