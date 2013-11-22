class Crashlytics::WebhookService < Service

	@@provider = :crashlytics
	@@event_type = :issue

	def instrument payload
		Rails.logger.info "instrumenting crashlytics"
		publish(@@provider, @@event_type, {
			:company_id => payload[:company_id], 
			:event => payload[:event]
		})
  # rescue StandardError, e
  # 	Rails.logger.info e.inspect  
	end
end