class	Stripe::Event::ChargeSucceededSerializer < TextItemSerializer
	#attributes :amount, :description, :customer_email, :customer_name

	def property
		"@todo"
	end

	def action
		"Charge Succeeded"
	end

	def body
		"@todo"
	end

	 
end