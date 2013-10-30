class Stripe::BaseEvent < FeedItem
	include Mongoid::Document

	field :amount, :type => Float
	field :object_id, :type => String
	field :description, :type => String
	field :livemode, :type => Boolean
	field :customer_id, :type => String
	field :customer_name, :type => String
  field :customer_email, :type => String

  def base_url_path
		"https://manage.stripe.com"
	end

	def env_path
		livemode ? "" : "/test"
	end

	def after_build_hook company
		customer = Stripe::Customer.retrieve(customer_id,  company.default_stripe_provider_credentials.access_token)
		customer_email = customer[:email]
		customer_name = customer[:description]
	end

end