module Common::FeedService

	def self.add_to_feed(event, company)
		Rails.logger.info "Adding event #{event.provider_name}:#{event.event_name} to company feed: #{company.name}"
		event = company.add_event_to_feed event if event
		true
	end 

end