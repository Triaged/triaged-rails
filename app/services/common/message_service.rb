module Common::MessageService

	def self.new_message(feed_item, message_params)
		company = feed_item.company
		message = feed_item.messages.create(message_params)

		company.followers_of(message.feed_item.provider).each do |follower|
			Common::NotificationService.push_message follower, message
		end

		return message
	end 

end