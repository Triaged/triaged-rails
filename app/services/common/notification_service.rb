module Common::NotificationService

	def self.email email, notification
		return true
	end

	def self.push_message user, message
		alert = "#{message.author.name} is talking about a #{message.feed_item.provider_name.humanize} #{message.feed_item.event_name.humanize}"
		Common::NotificationService.push(user, message.feed_item.id, alert)
	end

	def self.push_feed_item user, item
		alert = "#{item.provider_name.humanize} #{item.event_name.humanize}: #{item.push_message}"

		Common::NotificationService.push(user, item.id, item.push_message)
	end

	def self.push user, external_id, alert
		push_token = user.push_tokens.where(service: "apns").first
		
		if push_token
			Rails.logger.info "Pushing to token: #{push_token.token}"
			# increment push count
			push_token.inc(count: 1)

			Rails.logger.info "PUSHING TO APNS TOKEN: #{push_token.token}"
			notification = Grocer::Notification.new(
			  device_token:      push_token.token,
			  alert:             alert,
			  badge:             push_token.count,
			  expiry:            Time.now + 60*60,     # optional; 0 is default, meaning the message is not stored
			  content_available: true,                  # optional; any truthy value will set 'content-available' to 1
				custom: {
					"external_id" => external_id.to_s
				}
			)

			GROCER.push(notification)
		end
	end

end