class	Stripe::Event::ChargeSucceededSerializer < TextItemSerializer
	#attributes :amount, :description, :customer_email, :customer_name

	def property
		"Live"
	end

	def action
		"$#{number_with_precision(object.amount, :precision => 2)} Charge Succeeded"
	end

	def body
		object.description
	end

	 
end