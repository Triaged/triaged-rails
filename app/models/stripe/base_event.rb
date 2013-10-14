class Stripe::BaseEvent < FeedItem
	include Mongoid::Document

	field :amount, :type => Float
	field :object_id, :type => String
	field :description, :type => String
	field :livemode, :type => Boolean
	field :customer_id, :type => String
	field :customer_name, :type => String
  field :customer_email, :type => String

  after_initialize :retrieve_customer_details
  
	def base_url_path
		"https://manage.stripe.com"
	end

	def env_path
		livemode ? "" : "/test"
	end

	def retrieve_customer_details
		customer = Stripe::Customer.retrieve(customer_id,  company.stripe_provider_credentials.access_token)
		customer_email = customer[:email]
		customer_name = customer[:description]
	end

end