class Braintree::Event::SubscriptionChargedUnsuccessfullySerializer < TextItemSerializer
	#attributes :project, :message, :culprit, :logger, :level

	def property
		"Braintree"
	end

	def action
		"Subscription Charge Failed"
	end

	def body
		"$#{object.amount}, Plan Id: #{object.plan_id}"
	end
end