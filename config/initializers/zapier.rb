ActiveSupport::Notifications.subscribe "event.zapier.zap" do |name, start, finish, id, payload|
  Common::WebhookService.build_event_and_add_to_feeds(Zapier::Event::Zap, payload)
end