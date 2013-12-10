class Braintree::Event::TransactionDisbursedSerializer < TextItemSerializer
	#attributes :project, :message, :culprit, :logger, :level

	def property
		"Braintree"
	end

	def action
		"Transaction Disbursed"
	end

	def body
		"$#{object.amount}, Plan Id: #{object.plan_id}"
	end
end