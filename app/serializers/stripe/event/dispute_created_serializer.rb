class Stripe::Event::DisputeCreatedSerializer < TextItemSerializer
	#attributes :amount, :description, :customer_email, :customer_name

	def property
		"Stripe"
	end

	def action
		"Dispute Created"
	end

	def body
		body = "#{ActionView::Base.new.number_to_currency(object.amount)}"
		body += "\n#{object.status} - #{object.reason}"
		body += "\n#{object.evidence_due_by}"
		body
	end

	 
end