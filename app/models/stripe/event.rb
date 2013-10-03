class Stripe::Event < FeedItem
	include Mongoid::Document

	field :amount, :type => Float
	field :description, :type => String
	field :livemode, :type => Boolean


	

	def base_url_path
		"https://manage.stripe.com"
	end

	def env_path
		livemode ? "" : "/test"
	end

end