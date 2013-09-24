class	Stripe::Event::ChargeSucceededSerializer < ActiveModel::Serializer
	 	
	  attributes :provider, :event, :id, :amount

	  def provider
	  	"stripe"
	  end

	  def event
	  	"charge_succeeded"
	  end
end