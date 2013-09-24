ActiveSupport::Notifications.subscribe "airbrake.exception" do |name, start, finish, id, payload|
  Common::WebhookService.build_event_and_add_to_feeds(Airbrake::Event::Exception, payload)
end