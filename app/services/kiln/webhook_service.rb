class Kiln::WebhookService < Service

	def instrument payload
		event = payload[:event]
		event_type = payload[:event_type]
		company = Company.find(payload[:company_id])

		publish(event_type, {:company_id => company.id, :event => event})
  # rescue StandardError, e
  # 	Rails.logger.info e.inspect  
	end

	def publish(event_type, payload)
		Rails.logger.info "kiln.#{event_type}"
		ActiveSupport::Notifications.instrument("kiln.#{event_type}", payload)
		Rails.logger.info "Published"
 	end

end