class	Stripe::Event::ChargeSucceededSerializer < TextItemSerializer
	#attributes :amount, :description, :customer_email, :customer_name

	def property
		""
	end

	def action
		"$#{object.amount} Charge Succeeded"
	end

	def body
		object.description
	end

	 
end