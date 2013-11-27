class Braintree::WebhookService < Service 

	@@provider = :braintree
	
	def instrument payload
		webhook_notification = Braintree::WebhookNotification.parse(
  		payload[:bt_signature], payload[:bt_payload]
		)
		event_type = webhook_notification.kind
		company = get_company payload
		access_token = company.stripe_provider_credentials.access_token
		Rails.logger.info company.inspect
		
		# Validate event and fill customer data
		# event = Stripe::Event.retrieve(payload[:id], access_token)

		publish(@@provider, event_type, {:company_id => company.id, :event => payload}) if payload["livemode"]
  # rescue StandardError, e
  # 	Rails.logger.info e.inspect  
	end

	def get_company payload
 		company = ProviderCredential.where(provider: Provider.named("stripe"), uid: payload[:user_id]).first.user.company
 		company
 	end


end