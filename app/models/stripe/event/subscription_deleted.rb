class Stripe::Event::SubscriptionDeleted < Stripe::BaseEvent
  include Mongoid::Document

  field :amount, :type => Float
  field :plan_name, :type => String
  field :ended_at, :type => DateTime
  field :customer_name, :type => String
  field :customer_email, :type => String

  def self.create_from_webhook event
  	data = event.data.object
  	event = Stripe::Event::SubscriptionDeleted.new(
  		amount: event.amount,
			plan_name: event.plan.name, 
			ended_at: event.ended_at,
		 	customer_name: event.customer_name,
		 	customer_email: event.customer_email
		)
  end
end
