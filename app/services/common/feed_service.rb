module Common::FeedService

	def self.add_to_feed(event, company)
		event = company.add_event_to_feed event
		Rails.logger.info event.errors.inspect
		return false unless event.persisted? # This will fail if duplicate item exists in company feed
  	
  	company.push_event_to_followers event
  	true
	end 

end