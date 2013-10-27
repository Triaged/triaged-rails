class Stripe::Event::DisputeCreatedSerializer < TextItemSerializer
  #attributes :id

  def property
		"@todo"
	end

	def action
		"Dispute Created"
	end

	def body
		"@todo"
	end
end
