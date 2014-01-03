class Crashlytics::Event::Verification < FeedItem
  include Mongoid::Document

  

  
	def self.build_from_webhook data
		event = Crashlytics::Event::Issue.new(
			external_id: "crsh-#{DateTime.now}"
		)
	end

	def should_push?
		true
	end

	def push_message
		"Crashlytics is verified"
	end

end