class Braintree::Event::SubscriptionWentActiveSerializer < TextItemSerializer
	#attributes :project, :message, :culprit, :logger, :level

	def property
		"Braintree"
	end

	def action
		"Subscription Active"
	end

	def body
		"$#{object.amount}, Plan Id: #{object.plan_id}"
	end
end