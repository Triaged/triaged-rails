class Stripe::Event::TransferPaid < Stripe::BaseEvent
  include Mongoid::Document

  field :bank_name, :type => String

  def self.create_from_webhook data
  	event = Stripe::Event::TransferPaid.new(
  		amount: (data.data.object.amount / 100),
  		bank_name: data.data.object.account.bank_name
  		external_id: data.id,
			timestamp: DateTime.strptime(data.created.to_s,'%s')
		)
  end

  def build_html_url
		self.html_url = base_url_path + env_path + "/transfers/#{external_id}"
	end

end
