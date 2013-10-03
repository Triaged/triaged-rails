class Stripe::Event::ChargeSucceeded < FeedItem
  include Mongoid::Document

  field :amount, :type => Float
  field :customer_description, :type => String
  field :customer_email, :type => String
  field :description, :type => String

  def self.build_from_webhook data
  	event = Stripe::Event::ChargeSucceeded.new(
														amount: data.data.object.amount,
														customer_description: data.customer_description,
														description: data.data.object.description,
														customer_email: data.customer_email,
														external_id: data.id)
		return event
	end

end
