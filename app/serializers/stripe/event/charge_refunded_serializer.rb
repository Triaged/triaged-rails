class Stripe::Event::ChargeRefundedSerializer < EventSerializer
  attributes :amount, :description
end
