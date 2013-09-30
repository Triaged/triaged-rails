class Kiln::WebhookService < Service

	def instrument payload
		event = payload[:event]
		service = payload[:service]
		event_type = payload[:event_type]

		publish(event_type, service, event})
  # rescue StandardError, e
  # 	Rails.logger.info e.inspect  
	end

	def publish(event_type, payload)
		key =  "status_page.#{event_type}"
		Rails.logger.info key
		ActiveSupport::Notifications.instrument(key, payload)
	end

end