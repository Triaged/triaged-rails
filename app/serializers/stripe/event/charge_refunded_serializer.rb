class Stripe::Event::ChargeRefundedSerializer < TextItemSerializer
  #attributes :amount, :description

  def property
		""
	end

	def action
		"$#{object.amount} Charge Refunded"
	end

	def body
		object.description
	end
end
