class Stripe::Event::SubscriptionCreatedSerializer < TextItemSerializer
	#attributes :amount, :description, :customer_email, :customer_name

	def property
		"Stripe"
	end

	def action
		"New Subscription"
	end

	def body
		body = ""
		body += "#{object.customer_name} signed up for " if object.customer_name
		body += "#{object.plan_name} (#{ActionView::Base.new.number_to_currency(object.amount)}/#{object.interval})"
		body
	end

	 
end