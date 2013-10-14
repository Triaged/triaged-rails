class Stripe::Event::InvoicePaymentSuceeded< Stripe::BaseEvent
  include Mongoid::Document

  field :customer_name, :type => String
  field :customer_email, :type => String

  def self.create_from_webhook event
  	data = event.data.object
  	event = Stripe::Event::InvoicePaymentSuceeded.new(
  		amount: data.data.object.total,
			#customer_name: data.customer_name, 
			#customer_email: data.customer_email,
			external_id: data.id,
			timestamp: DateTime.strptime(data.created,'%s')
		)
  end

  def build_html_url
		self.html_url = base_url_path + env_path + "/invoices/#{external_id}"
	end

end
