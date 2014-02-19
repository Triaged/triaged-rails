class Braintree::Event::SubscriptionChargedUnsuccessfully < FeedItem


  # field :amount, :type => String
  # field :plan_id, :type => String


	def self.build_from_webhook data

		event = Braintree::Event::SubscriptionCanceled.new(
			amount: (data.subscription.price / 100),
			plan_id: (data.subscription.plan_id),
			external_id: data.subscription.id,
			timestamp: DateTime.strptime(data.created.to_s,'%s')
		)
		return event
	end

	def build_html_url
		self.html_url = "http://braintreepayments.com"
	end

end
