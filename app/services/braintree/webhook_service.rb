class Braintree::WebhookService < Service 

	@@provider = :braintree
	
	def instrument payload
		webhook_notification = Braintree::WebhookNotification.parse(
  		payload[:bt_signature], payload[:bt_payload]
		)
		event_type = webhook_notification.kind
		company = Company.find payload[:company_id]
		
		
		publish(@@provider, event_type, {:company_id => company.id, :event => webhook_notification})
  # rescue StandardError, e
  # 	Rails.logger.info e.inspect  
	end

end