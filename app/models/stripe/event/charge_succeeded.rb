class Stripe::Event::ChargeSucceeded < FeedItem
  include Mongoid::Document

  field :amount, :type => Float
  field :customer_name, :type => String
  field :customer_email, :type => String
  field :description, :type => String

  def self.build_from_webhook event
  	data = event.data.object
  	event = Stripe::Event::ChargeSucceeded.new(
														amount: data.amount,
														customer_name: data.customer,
														description: data.description,
														customer_email: data.customer,
														external_id: data.id)
		return event
	end

end
