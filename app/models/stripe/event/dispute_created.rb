class Stripe::Event::DisputeCreated < Stripe::BaseEvent
  include Mongoid::Document

  field :status, :type => String
  field :reason, :type => String
  field :evidence_due_by, :type => DateTime
  field :evidence, :type => String
  field :charge_id, :type => String

  def self.create_from_webhook event
  	data = event.data.object
  	event = Stripe::Event::DisputeCreated.new(
  		amount: data.data.object.amount,
			status: data.data.object.status,
			reason: data.data.object.reason,
			evidence_due_by: data.data.object.evidence_due_by,
			evidence: data.data.object.evidence,
			charge_id: data.data.object.charge,
		 	customer_id: data.data.object.card.customer,
		 	external_id: data.id,
		 	timestamp: DateTime.strptime(data.created,'%s')
		)
  end

  def build_html_url
		self.html_url = base_url_path + env_path + "/payments/#{charge_id}"
	end

end
