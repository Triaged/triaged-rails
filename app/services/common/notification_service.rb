module Common::NotificationService

	def self.email email, notification
		return true
	end

	def self.push_message user, message
		alert = "#{message.author.name} is discussing a #{message.feed_item.provider_name.humanize} #{message.feed_item.event_name.humanize}"
		Common::NotificationService.push(user, message.feed_item.id, alert)
	end

	def self.push_feed_item user, item
		alert = "#{item.provider_name.humanize} #{item.human_event_name}"
		Common::NotificationService.push(user, item.id, alert)
	end

	def self.push_test user, alert
		Common::NotificationService.push(user, 0, alert)
	end

	def self.push user, external_id, alert
		push_token = user.push_tokens.where(service: "apns").first
		
		if push_token and user.push_enabled
			# increment push count
			push_token.inc(count: 1)

			Rails.logger.info "PUSHING TO APNS TOKEN: #{push_token.token}"
			notification = Grocer::Notification.new(
			  device_token:      push_token.token,
			  alert:             alert.truncate(253),
			  sound: 						 'default',
			  badge:             push_token.count,
			  expiry:            Time.now + 60*60*12,     # optional; 0 is default, meaning the message is not stored
			  content_available: true,                  # optional; any truthy value will set 'content-available' to 1
				custom: {
					"external_id" => external_id.to_s
				}
			)

			# Connection Pool
			GROCER.with do |connection|
  			connection.push(notification)
			end
			

			GROCER_FEEDBACK.each do |attempt|
  			puts attempt.inspect
  			begin
  				PushToken.find_by(token: attempt.device_token).destroy
  			rescue
  				puts "no token found"
  			end
			end
		end
	end

end