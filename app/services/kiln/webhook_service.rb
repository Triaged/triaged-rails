class Kiln::WebhookService < Service

	@@provider = :kiln

	def instrument payload
		publish(@@provider, payload[:event_type], {
			:company_id => payload[:company_id], 
			:event => payload[:event]
		})
  # rescue StandardError, e
  # 	Rails.logger.info e.inspect  
	end
end