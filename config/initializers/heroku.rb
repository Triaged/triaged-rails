ActiveSupport::Notifications.subscribe "event.heroku.deploy" do |name, start, finish, id, payload|
  Common::WebhookService.build_event_and_add_to_feeds(Heroku::Event::Deploy, payload)
end