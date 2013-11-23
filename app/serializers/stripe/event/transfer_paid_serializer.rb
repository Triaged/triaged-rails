class Stripe::Event::TransferPaidSerializer < TextItemSerializer
	#attributes :amount, :description, :customer_email, :customer_name

	def property
		"Stripe"
	end

	def action
		"#{ActionView::Base.new.number_to_currency(object.amount)} Transfer Paid"
	end

	def body
		"Transfered to #{object.bank_name}" if object.bank_name
	end

	 
end