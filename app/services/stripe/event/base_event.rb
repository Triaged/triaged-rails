class Stripe::BaseEvent < BaseServiceEvent
	
	def base_url_path
		"https://manage.stripe.com"
	end

	def build_customer company
		if self.customer_id
			customer = Stripe::Customer.retrieve(customer_id,  company.stripe_provider_credentials.access_token)
			self.customer_email = customer[:email]
			self.customer_name = customer[:description]
		end
	end

end