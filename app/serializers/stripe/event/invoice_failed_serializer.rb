class Stripe::Event::InvoiceFailedSerializer < TextItemSerializer
  #attributes :id

  def property
		"Stripe"
	end

	def action
		"Invoice Failed"
	end

	def body
		"@todo"
	end
end
