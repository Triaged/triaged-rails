ActiveSupport::Notifications.subscribe "event.hockey_app.feedback" do |name, start, finish, id, payload|
  Common::WebhookService.build_event_and_add_to_feeds(HockeyApp::Event::Feedback, payload)
end

ActiveSupport::Notifications.subscribe "event.hockey_app.crash_reason" do |name, start, finish, id, payload|
  Common::WebhookService.build_event_and_add_to_feeds(HockeyApp::Event::CrashReason, payload)
end

ActiveSupport::Notifications.subscribe "event.hockey_app.app_version" do |name, start, finish, id, payload|
  Common::WebhookService.build_event_and_add_to_feeds(HockeyApp::Event::AppVersion, payload)
end