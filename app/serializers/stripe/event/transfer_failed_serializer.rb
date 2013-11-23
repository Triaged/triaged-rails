class Stripe::Event::TransferFailedSerializer < TextItemSerializer
	#attributes :amount, :description, :customer_email, :customer_name

	def property
		"Stripe"
	end

	def action
		"#{ActionView::Base.new.number_to_currency(object.amount)} Transfer Failed"
	end

	def body
		""
	end

	 
end