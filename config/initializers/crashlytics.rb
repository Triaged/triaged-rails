ActiveSupport::Notifications.subscribe "event.crashlytics.issue" do |name, start, finish, id, payload|
  Common::WebhookService.build_event_and_add_to_feeds(Crashlytics::Event::Issue, payload)
end