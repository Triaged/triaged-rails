module Common::FeedService

	def self.build_event_card(json_event, company, app)
		puts "building event card: #{json_event}"

		return if json_event.nil? # event will be nil if validation failed
		
		event_hash = JSON.parse(json_event)

		event_hash = self.set_provider_from_hash(event_hash, company) # Set Provider
		event_hash = self.set_event_type_from_hash(event_hash, event_hash[:provider], company) # Set EventType
		event_hash = self.set_author_from_hash(event_hash, company) # Set Author
		event_hash = self.set_images_from_hash(event_hash, company) # Set Images
		event_hash = self.set_workflows_from_hash(event_hash, company, app) # Set Workflows

		# build card
		card = FeedItem.new(event_hash)
		puts "card: #{card.inspect}"

		# generic after init hook
		card.after_build_hook company

		# add event to company feed
		self.add_to_feed card, company
		puts "Added event card: #{json_event}"
	end

	def self.add_to_feed(event, company)
		puts "adding..."
		Rails.logger.info event
		if event
			Rails.logger.info "Adding event #{event.provider_name}:#{event.event_name} to company feed: #{company.name}"
			company.add_event_to_feed event 
			return true
		else
			return false
		end
	end

	def self.set_workflows_from_hash event_hash, company, app
		workflows_array = event_hash[:workflows] || []
		Rails.logger.info "Workflows: #{workflows_array.inspect}"

		workflows_array.each do |workflow|
			workflow_name = workflow[:name]
			provider_name = workflow[:provider]
			
			begin
				provider = Provider.named(provider_name)
			rescue ActiveRecord::RecordNotFound
				provider = nil
			end

			provider_workflows = ProviderWorkflow.where(name: workflow_name, provider: provider)
			
			provider_workflows.each do |provider_workflow|
				event_hash[:feed_item_workflows] << FeedItemWorkflow.create(provider_workflow: provider_workflow)
			end
		end
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

	# def self.set_provider_property_from_hash event_hash, provider, company
	# 	property_name = event_hash.delete("property_name")

	# 	provider_account = ProviderAccount.find_by provider: provider, company: company
		
	# 	if provider_account
	# 		property = provider_account.provider_properties.find_by name: property_name
	# 		event_hash[:provider_property] = property
	# 	end

	# 	return event_hash
	# end

	def self.set_event_type_from_hash event_hash, provider, company
		
		event_name = event_hash.delete("event_name")
		event_type = EventType.find_or_create_by provider: provider, name: event_name
		event_hash[:event_type] = event_type

		return event_hash
	end

	def self.set_author_from_hash event_hash, company
		puts "set author from hash"
		author_service = Common::AuthorService.new(event_hash.delete("author"), company)
		event_hash[:author] = author_service.user if author_service.user?
		return event_hash
	end

	def self.set_images_from_hash event_hash, company
		event_hash[:remote_event_image_url] = event_hash.delete("image_url") if event_hash["image_url"]
		return event_hash
	end

end