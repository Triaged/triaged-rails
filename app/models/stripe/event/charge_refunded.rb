class Stripe::Event::ChargeRefunded < Stripe::BaseEvent
  include Mongoid::Document

  field :amount_refunded, :type => Float

  
	def self.build_from_webhook data
  	event = Stripe::Event::ChargeRefunded.new(
			amount: (data.data.object.amount / 100),
			amount_refunded: (data.data.object.amount_refunded / 100),
			customer_id: data.data.object.card.customer,
			description: data.data.object.description,
			external_id: data.id,
			timestamp: DateTime.strptime(data.created.to_s,'%s')
		)
		return event
	end

	def build_html_url
		self.html_url = base_url_path + env_path + "/payments/#{external_id}"
	end
end
