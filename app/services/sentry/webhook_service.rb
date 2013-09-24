class Sentry::WebhookService < Service
	
	def instrument payload
		publish({:company_id => payload[:company_id], :event => payload[:event]})
  # rescue StandardError, e
  # 	Rails.logger.info e.inspect  
	end

	def publish(payload)
		Rails.logger.info "sentry.exception"
		ActiveSupport::Notifications.instrument("sentry.exception", payload)
		Rails.logger.info "Published"
 	end

end