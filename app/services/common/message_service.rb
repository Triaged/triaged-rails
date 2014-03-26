module Common::MessageService

	def self.new_message(feed_item, message_params)
		company = feed_item.company
		message = Messages::Chat.new(message_params)
		feed_item.messages << message
		Rails.logger.info message.inspect
		#self.parse_mentions(company, message)
		
		# ensure feed_item.updated_at is fired
		feed_item.save!

		message.user_mentions ? self.push_to_mentions(message) : self.push_to_followers(message, company, feed_item.provider)

		return message
	end 

	def self.toggle_thumbsup(feed_item, thumbsup_params)
		company = feed_item.company
		thumbsup =  Messages::Thumbsup.new(message_params)
		feed_item.messages << thumbsup
		
		# ensure feed_item.updated_at is fired
		feed_item.save!

		self.push_thumbsup_to_author(thumbsup, feed_item)

		return thumbsup
	end

	def self.push_to_followers message, company, provider
		Rails.logger.info "pushing to followers"
		company.followers_of(provider).each do |follower|
			Common::NotificationService.push_message(follower, message) unless (follower == message.author || follower.ignores?(message.feed_item.provider))
		end
	end

	def self.push_to_mentions message
		Rails.logger.info "pushing to mentions"
		User.find(message.user_mentions).each do |user|
			Common::NotificationService.push_message user, message
		end
	end

	def self.push_thumbsup_to_author thumbsup, feed_item
		Common::NotificationService.push_thumbsup(thumbsup.user, feed_item) if feed_item.author
	end

	def self.parse_mentions(company, message)
		body = message.body
		words = body.split
		words.select {|word| word.starts_with? "@"}.each do |word|
			begin
				slug = word[1..-1]
				user = company.users.find(slug)
				message.push(user_mentions: user.id)
				
			rescue ActiveRecord::RecordNotFound => e
				next
			end
		end
	end

end