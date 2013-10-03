class	Stripe::Event::ChargeSucceededSerializer < EventSerializer
	attributes :amount, :description, :customer_email, :customer_description

	 
end