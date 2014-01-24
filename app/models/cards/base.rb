class Cards::Base < FeedItem
	include Mongoid::Document

	def should_collapse?
		self.class.name == "Cards::EventSet" && self.events.count == 1
	end
	
end