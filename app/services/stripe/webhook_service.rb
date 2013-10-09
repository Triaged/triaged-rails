class Stripe::WebhookService < Service

	@@provider = :stripe
	
	def instrument payload
		event_type = payload[:type]
		company = get_company payload
		Rails.logger.info company.inspect
		
		# Validate event and fill customer data
		event = Stripe::Event.retrieve(payload[:id], company.stripe_provider_credentials.access_token)
		payload = retrieve_customer_details payload, access_token
		
		publish(@@provider, event_type, {:company_id => company.id, :event => payload})
  # rescue StandardError, e
  # 	Rails.logger.info e.inspect  
	end

	def get_company payload
 		company = ProviderCredential.where(provider: Provider.named("stripe"), uid: payload[:user_id]).first.company
 		company
 	end

 	def retrieve_customer_details event, access_token
 		customer = Stripe::Customer.retrieve(event[:data][:object][:card][:customer], access_token)
		event[:customer_email] = customer[:email]
		event[:customer_description] = customer[:description]
		event
	end

end