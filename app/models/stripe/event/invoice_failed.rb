class Stripe::Event::InvoiceFailed < Stripe::BaseEvent
  include Mongoid::Document

  field :customer_name, :type => String
  field :customer_email, :type => String

  def self.create_from_webhook event
  	data = event.data.object
  	event = Stripe::Event::InvoiceFailed.new(
  		amount: data.amount,
			customer_name: data.customer_name, 
			customer_email: data.customer_email,
			external_id: data.id,
			timestamp: DateTime.parse(data.created)
		)
  end
end
