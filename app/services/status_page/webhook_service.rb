class StatusPage::WebhookService < Service

	def instrument payload
		event = payload[:event]
		service = payload[:service]
		event_type = payload[:event_type]

		publish(event_type, service, event)
  # rescue StandardError, e
  # 	Rails.logger.info e.inspect  
	end
end