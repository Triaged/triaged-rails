module Common::MessageService

	def self.new_message(feed_item, message_params)
		company = feed_item.company
		message = feed_item.messages.build(message_params)
		self.parse_mentions(company, message)
		
		# ensure feed_item.updated_at is fired
		feed_item.save!

		message.user_mentions ? self.push_to_mentions(message) : self.push_to_followers(message, company, feed_item.provider)

		return message
	end 

	def self.push_to_followers message, company, provider
		Rails.logger.info "pushing to followers"
		company.followers_of(provider).each do |follower|
			Common::NotificationService.push_message(follower, message) unless (follower == message.author)
		end
	end

	def self.push_to_mentions message
		Rails.logger.info "pushing to mentions"
		User.find(message.user_mentions).each do |user|
			Common::NotificationService.push_message user, message
		end
	end

	def self.parse_mentions(company, message)
		body = message.body
		words = body.split
		words.select {|word| word.starts_with? "@"}.each do |word|
			begin
				slug = word[1..-1]
				if(slug == "triage")
					 Admin::MentionMessage.create(feed_item: message.feed_item)
				else
					user = company.users.find(slug)
					message.push(user_mentions: user.id)
				end
			rescue  Mongoid::Errors::DocumentNotFound
				next
			end
		end
	end

end