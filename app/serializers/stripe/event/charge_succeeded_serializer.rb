class	Stripe::Event::ChargeSucceededSerializer < FeedItemSerializer
	attributes :amount, :description, :customer_email, :customer_name

	 
end