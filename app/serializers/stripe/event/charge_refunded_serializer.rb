class Stripe::Event::ChargeRefundedSerializer < TextItemSerializer
  #attributes :amount, :description

  def property
		"Live"
	end

	def action
		"Charge Refunded"
	end

	def body
		"#{object.amount}\n#{object.description}"
	end
end
