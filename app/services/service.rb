class Service

	def publish(provider, event_type, payload)
		event_name = "event.#{provider}.#{event_type}"
		Rails.logger.info "Publishing #{event_name}"
		ActiveSupport::Notifications.instrument(event_name, payload)
		Rails.logger.info "Published #{event_name}"
 	end
end