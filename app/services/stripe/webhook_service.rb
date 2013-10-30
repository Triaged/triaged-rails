class Stripe::WebhookService < Service

	@@provider = :stripe
	
	def instrument payload
		event_type = payload[:type]
		company = get_company payload
		access_token = company.stripe_provider_credentials.access_token
		Rails.logger.info company.inspect
		
		# Validate event and fill customer data
		# event = Stripe::Event.retrieve(payload[:id], access_token)
		
		publish(@@provider, event_type, {:company_id => company.id, :event => payload})
  # rescue StandardError, e
  # 	Rails.logger.info e.inspect  
	end

	def get_company payload
 		company = ProviderCredential.where(provider: Provider.named("stripe"), uid: payload[:user_id]).first.user.company
 		company
 	end

 	

end