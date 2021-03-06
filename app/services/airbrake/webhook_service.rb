class Airbrake::WebhookService < Service

	@@provider = :airbrake
	@@event_type = :exception
	
	def instrument payload
		publish(@@provider, @@event_type,  {
			:company_id => payload[:company_id],
			:event => payload[:event]
		})
  # rescue StandardError, e
  # 	Rails.logger.info e.inspect  
	end
end