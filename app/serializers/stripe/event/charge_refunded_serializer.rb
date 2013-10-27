class Stripe::Event::ChargeRefundedSerializer < TextItemSerializer
  #attributes :amount, :description

  def property
		"@todo"
	end

	def action
		"Charge Refunded"
	end

	def body
		"@todo"
	end
end
