class Stripe::Event::ChargeRefundedSerializer < TextItemSerializer
  #attributes :amount, :description

  def property
		"Live"
	end

	def action
		"$#{number_with_precision(object.amount, :precision => 2)} Charge Refunded"
	end

	def body
		object.description
	end
end
