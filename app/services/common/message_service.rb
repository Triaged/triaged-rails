module Common::MessageService

	def self.new_message(feed_item, message_params)
		company = feed_item.company

		
		message = feed_item.messages.build(message_params)
		#ensure feed_item.updated_at is tracked
		feed_item.save!

		company.followers_of(message.feed_item.provider).each do |follower|
			Common::NotificationService.push_message follower, message
		end

		return message
	end 

end