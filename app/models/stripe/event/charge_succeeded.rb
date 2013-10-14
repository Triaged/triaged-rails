class Stripe::Event::ChargeSucceeded < Stripe::BaseEvent
  include Mongoid::Document

  field :customer_id, :type => String
  field :customer_description, :type => String
  field :customer_email, :type => String
  
	def self.build_from_webhook data
  	event = Stripe::Event::ChargeSucceeded.new(
			amount: data.data.object.amount,
			customer_id: data.data.object.card.customer,
			customer_description: data.customer_description,
			description: data.data.object.description,
			customer_email: data.customer_email,
			object_id: data.data.object.id,
			external_id: data.id,
			timestamp: DateTime.strptime(data.created,'%s')
		)
		return event
	end

	def build_html_url
		self.html_url = base_url_path + env_path + "/payments/#{object_id}"
	end

end
