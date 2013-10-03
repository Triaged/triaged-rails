class Stripe::Event::ChargeSucceeded < FeedItem
  include Mongoid::Document

  field :amount, :type => Float
  field :customer_name, :type => String
  field :customer_email, :type => String
  field :description, :type => String

  def self.build_from_webhook data
  	event = Stripe::Event::ChargeSucceeded.new(
														amount: data.data.object.amount,
														#customer_name: data.customer,
														description: data.data.object.description,
														#customer_email: data.data.object.customer,
														external_id: data.id)
		return event
	end

end
