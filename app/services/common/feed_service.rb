module Common::FeedService

	def self.add_to_feed(event, company)
		Rails.logger.info "Adding event to feed"
		event = company.add_event_to_feed event
		true
	end 

end