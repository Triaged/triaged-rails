class Zapier::WebhookService < Service

	@@provider = :zapier
	@@event_type = :zap
	
	def instrument payload
		publish(@@provider, @@event_type,  {
			:company_id => payload[:company_id],
			:event => payload[:event]
		})
  # rescue StandardError, e
  # 	Rails.logger.info e.inspect  
	end
end