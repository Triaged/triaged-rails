class Braintree::Event::SubscriptionChargedUnsuccessfully < FeedItem
  include Mongoid::Document

	def self.build_from_webhook data

		event = Braintree::Event::SubscriptionChargedUnsuccessfully.new(
			amount: (data.data.object.amount / 100),
			customer_id: data.data.object.customer,
			description: data.data.object.description,
			object_id: data.data.object.id,
			external_id: data.id,
			timestamp: DateTime.strptime(data.created.to_s,'%s')
		)
		return event
	end

	def build_html_url
		self.html_url = base_url_path + env_path + "/payments/#{object_id}"
	end

end
