class Stripe::Event::TransferFailed < Stripe::BaseEvent

  def self.create_from_webhook data
  	event = Stripe::Event::TransferPaid.new(
  		amount: (data.data.object.amount / 100),
  		external_id: data.id,
			timestamp: DateTime.strptime(data.created.to_s,'%s')
		)
  end

  def build_html_url
		self.html_url = base_url_path + env_path + "/transfers/#{external_id}"
	end

end