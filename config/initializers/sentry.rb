ActiveSupport::Notifications.subscribe "sentry.exception" do |name, start, finish, id, payload|
  Common::WebhookService.build_event_and_add_to_feeds(Sentry::Event::Exception, payload)
end