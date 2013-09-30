module Common::MessageService

	def self.new_message(feed_item, message_params)
		company = feed_item.company
		message = feed_item.messages.create(message_params)
		# Add an item to the feed
		message_feed_item = Messages::MessageFeedItem.build_from_message message
		Rails.logger.info message_feed_item.inspect
		Common::FeedService.add_to_feed(message_feed_item, company)

		# # Send notifications
		# message.emails_to_notify.each do |email|
		# 	user = company.users.find_by email: email
		# 	Common::NotificationService.push user, message
		# rescue # NotFound
		# 	Common::NotificationService.email email, message
		# end

		return message
	end 

end