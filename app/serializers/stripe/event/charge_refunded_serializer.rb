class Stripe::Event::ChargeRefundedSerializer < FeedItemSerializer
  attributes :amount, :description
end
