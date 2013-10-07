ActiveSupport::Notifications.subscribe "event.stripe.charge.succeeded" do |name, start, finish, id, payload|
	Common::WebhookService.build_event_and_add_to_feeds(Stripe::Event::ChargeSucceeded, payload)
end

ActiveSupport::Notifications.subscribe "event.stripe.charge.refunded" do |name, start, finish, id, payload|
  Common::WebhookService.build_event_and_add_to_feeds(Stripe::Event::ChargeRefunded, payload)
end

ActiveSupport::Notifications.subscribe "event.stripe.dispute.created" do |name, start, finish, id, payload|
  Common::WebhookService.build_event_and_add_to_feeds(Stripe::Event::DisputeCreated, payload)
end

ActiveSupport::Notifications.subscribe "event.stripe.invoice.failed" do |name, start, finish, id, payload|
  Common::WebhookService.build_event_and_add_to_feeds(Stripe::Event::InvoiceFailed, payload)
end

ActiveSupport::Notifications.subscribe "event.stripe.subscription.deleted" do |name, start, finish, id, payload|
  Common::WebhookService.build_event_and_add_to_feeds( Stripe::Event::SubscriptionDeleted, payload)
end


TYPE_LIST = Set[
    'account.updated',
    'account.application.deauthorized',
    'balance.available',
    'charge.succeeded',
    'charge.failed',
    'charge.refunded',
    'charge.captured',
    'charge.dispute.created',
    'charge.dispute.updated',
    'charge.dispute.closed',
    'customer.created',
    'customer.updated',
    'customer.deleted',
    'customer.card.created',
    'customer.card.updated',
    'customer.card.deleted',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted',
    'customer.subscription.trial_will_end',
    'customer.discount.created',
    'customer.discount.updated',
    'customer.discount.deleted',
    'invoice.created',
    'invoice.updated',
    'invoice.payment_succeeded',
    'invoice.payment_failed',
    'invoiceitem.created',
    'invoiceitem.updated',
    'invoiceitem.deleted',
    'plan.created',
    'plan.updated',
    'plan.deleted',
    'coupon.created',
    'coupon.deleted',
    'transfer.created',
    'transfer.updated',
    'transfer.paid',
    'transfer.failed',
    'ping'
  ].freeze