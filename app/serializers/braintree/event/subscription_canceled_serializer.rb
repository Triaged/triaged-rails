class Braintree::Event::SubscriptionCanceledSerializer < TextItemSerializer
	#attributes :project, :message, :culprit, :logger, :level

	def property
		"Braintree"
	end

	def action
		"Subscription Canceled"
	end

	def body
		"$#{object.amount}, Plan Id: #{object.plan_id}"
	end
end