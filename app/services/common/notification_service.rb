module Common::NotificationService

	def self.email email, notification
		return true
	end

	def self.push user, notification
		push_token = user.push_tokens.where(service: "apns").first
		if push_token
			Rails.logger.info "PUSHING TO APNS TOKEN: #{push_token.token}"
			notification = Grocer::Notification.new(
			  device_token:      push_token.token
			  alert:             notification,
			  badge:             1,
			  expiry:            Time.now + 60*60,     # optional; 0 is default, meaning the message is not stored
			  identifier:        1234,                 # optional
			  content_available: true                  # optional; any truthy value will set 'content-available' to 1
			)

			GROCER.push(notification)
		end

		return true
	end

end