class Stripe::Event::DisputeCreatedSerializer < TextItemSerializer
  #attributes :id

  def property
		"Stripe"
	end

	def action
		"Dispute Created"
	end

	def body
		"@todo"
	end
end
