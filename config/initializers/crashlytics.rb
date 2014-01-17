ActiveSupport::Notifications.subscribe "event.crashlytics.issue" do |name, start, finish, id, payload|
  Common::WebhookService.build_event_and_add_to_feeds(Crashlytics::Event::Issue, payload)
end

ActiveSupport::Notifications.subscribe "event.crashlytics.verification" do |name, start, finish, id, payload|
  Common::WebhookService.build_event_and_add_to_feeds(Crashlytics::Event::Verification, payload)
end
