class Stripe::Event::InvoicePaymentFailedSerializer < TextItemSerializer
	#attributes :amount, :description, :customer_email, :customer_name

	def property
		"Stripe"
	end

	def action
		"Invoice Failed"
	end

	def body
		body = "#{ActionView::Base.new.number_to_currency(object.amount)}"
		body += "from #{object.customer_name}" if object.customer_name
		body
	end

	 
end