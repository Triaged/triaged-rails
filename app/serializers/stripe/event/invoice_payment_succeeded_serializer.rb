class Stripe::Event::InvoicePaymentSucceededSerializer < TextItemSerializer
	#attributes :amount, :description, :customer_email, :customer_name

	def property
		"Stripe"
	end

	def action
		"#{ActionView::Base.new.number_to_currency(object.amount)} Charge Succeeded"
	end

	def body
		object.description
	end

	 
end