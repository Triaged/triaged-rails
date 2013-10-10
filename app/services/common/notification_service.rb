module Common::NotificationService

	def self.email email, notification
		return true
	end

	def self.push user, event
		push_token = user.push_tokens.where(service: "apns").first

		if push_token
			# increment push count
			push_token.inc(count: 1)

			Rails.logger.info "PUSHING TO APNS TOKEN: #{push_token.token}"
			notification = Grocer::Notification.new(
			  device_token:      push_token.token,
			  alert:             event.push_message,
			  badge:             push_token.count,
			  expiry:            Time.now + 60*60,     # optional; 0 is default, meaning the message is not stored
			  identifier:        event.id,                 # optional
			  content_available: true                  # optional; any truthy value will set 'content-available' to 1
			)

			GROCER.push(notification)
		end

		return true
	end

end