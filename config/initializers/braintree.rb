Braintree::Configuration.environment = :production

ActiveSupport::Notifications.subscribe "event.braintree.subscription_canceled" do |name, start, finish, id, payload|
	Common::WebhookService.build_event_and_add_to_feeds(Braintree::Event::SubscriptionCanceled, payload)
end# Add initialization content here

ActiveSupport::Notifications.subscribe "event.braintree.subscription_canceled" do |name, start, finish, id, payload|
	Common::WebhookService.build_event_and_add_to_feeds( Braintree::Event::SubscriptionChargedUnsuccessfully , payload)
end# Add initialization content here

ActiveSupport::Notifications.subscribe "event.braintree.subscription_canceled" do |name, start, finish, id, payload|
	Common::WebhookService.build_event_and_add_to_feeds( Braintree::Event::SubscriptionWentActive , payload)
end# Add initialization content here

ActiveSupport::Notifications.subscribe "event.braintree.subscription_canceled" do |name, start, finish, id, payload|
	Common::WebhookService.build_event_and_add_to_feeds( Braintree::Event::TransactionDisbursed,  payload)
end# Add initialization content here