ActiveSupport::Notifications.subscribe "event.beanstalk.push" do |name, start, finish, id, payload|
	Common::WebhookService.build_event_and_add_to_feeds(Beanstalk::Event::Push, payload)
end