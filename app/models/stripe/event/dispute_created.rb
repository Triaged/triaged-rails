class Stripe::Event::DisputeCreated < Stripe::BaseEvent
  include Mongoid::Document

  field :status, :type => String
  field :reason, :type => String
  field :evidence_due_by, :type => DateTime
  field :customer_name, :type => String
  field :customer_email, :type => String

  def self.create_from_webhook event
  	data = event.data.object
  	event = Stripe::Event::DisputeCreated.new(
  		amount: data.amount,
			status: data.status,
			reason: data.reason,
			evidence_due_by: data.evidence_due_by,
		 	customer_name: data.customer_name,
		 	customer_email: data.customer_email
		)
  end

end
