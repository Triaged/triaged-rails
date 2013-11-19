class Stripe::Event::ChargeRefundedSerializer < TextItemSerializer
  #attributes :amount, :description

  def property
		"Live"
	end

	def action
		"$#{ActionView::Base.new.number_to_currency(object.amount)} Charge Refunded"
	end

	def body
		object.description
	end
end
