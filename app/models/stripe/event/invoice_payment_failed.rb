class Stripe::Event::InvoicePaymentFailed < Stripe::BaseEvent
  include Mongoid::Document

  def self.create_from_webhook event
  	data = event.data.object
  	event = Stripe::Event::InvoicePaymentFailed.new(
  		amount: (data.data.object.total / 100),
			customer_id: data.data.object.card.customer,
			external_id: data.id,
			timestamp: DateTime.strptime(data.created.to_s,'%s')
		)
  end

  def build_html_url
		self.html_url = base_url_path + env_path + "/invoices/#{external_id}"
	end

end
