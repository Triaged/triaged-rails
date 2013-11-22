class Stripe::Event::SubscriptionDeletedSerializer < TextItemSerializer
  #attributes :id

  def property
		"Stripe"
	end

	def action
		"Subscription Deleted"
	end

	def body
		"@todo"
	end

end
