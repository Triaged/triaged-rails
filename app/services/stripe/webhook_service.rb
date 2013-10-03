class Stripe::WebhookService < Service
	
	def instrument payload
		stripe_user = ProviderCredential.where(provider: Provider.named("stripe"), uid: payload[:user_id]).first.user
		event = Stripe::Event.retrieve(payload[:id], stripe_user.stripe_provider_credentials.access_token)
		event = retrieve_customer_details event
		Rails.logger.info event.inspect
		publish({:company_id => stripe_user.company.id, :event => event})
  # rescue StandardError, e
  # 	Rails.logger.info e.inspect  
	end

	def publish(payload)
		Rails.logger.info "Publishing: stripe.#{payload[:event][:type]}"
		ActiveSupport::Notifications.instrument("stripe.#{payload[:event][:type]}", payload)
		Rails.logger.info "Published"
 	end

 	def retrieve_customer_details event
 		customer = Stripe::Customer.retrieve(event[:customer])
		event[:customer_email] = customer[:email]
		event[:customer_description] = customer[:description]
		event
	end

end