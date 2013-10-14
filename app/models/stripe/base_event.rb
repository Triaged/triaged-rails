class Stripe::BaseEvent < FeedItem
	include Mongoid::Document

	field :amount, :type => Float
	field :object_id, :type => String
	field :description, :type => String
	field :livemode, :type => Boolean
	field :customer_id, :type => String

	def base_url_path
		"https://manage.stripe.com"
	end

	def env_path
		livemode ? "" : "/test"
	end

end