class Stripe::Event::ChargeRefundedSerializer < TextItemSerializer
  #attributes :amount, :description

  def property
		"Live"
	end

	def action
		"$#{object.amount_refunded} Charge Refunded"
	end

	def body
		object.description
	end
end
