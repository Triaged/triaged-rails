class Kiln::WebhookService < Service

	@@provider = :kiln
	@@event_type = :push

	def instrument payload
		Rails.logger.info "instrumenting kiln"
		publish(@@provider, @@event_type, {
			:company_id => payload[:company_id], 
			:event => payload[:event]
		})
  # rescue StandardError, e
  # 	Rails.logger.info e.inspect  
	end
end