class Service

	def publish(provider, event_type, payload)
		event_name = "event.#{provider}.#{event_type}"
		ActiveSupport::Notifications.instrument(event_name, payload)
		Rails.logger.info "Published #{event_name}"
 	end
end