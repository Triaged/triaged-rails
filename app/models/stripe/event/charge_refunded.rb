class Stripe::Event::ChargeRefunded < FeedItem
  include Mongoid::Document

  field :amount, :type => Float
  field :customer_name, :type => String
  field :customer_email, :type => String

  def self.create_from_webhook event
  	data = event.data.object
  	event = Stripe::Event::ChargeRefunded.new(
			amount: data.amount,
		 	customer_name: data.customer,
		 	description: data.description,
		 	customer_email: data.customer
		 )
	end
end
