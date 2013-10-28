module Common::MessageService

	def self.new_message(feed_item, message_params)
		company = feed_item.company
		message = feed_item.messages.build(message_params)
		# ensure feed_item.updated_at is fired
		self.parse_mentions(company, message)
		feed_item.save!

		company.followers_of(feed_item.provider).each do |follower|
			Common::NotificationService.push_message follower, message
		end

		return message
	end 

	def self.parse_mentions(company, message)
		body = message.body
		words = body.split
		words.select {|word| word.starts_with? "@"}.each do |word|
			begin
				slug = word[1..-1]
				user = company.users.find(slug)
				message.push(user_mentions: user.id)
			rescue  Mongoid::Errors::DocumentNotFound
				next
			end
		end
	end

end