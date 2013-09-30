ActiveSupport::Notifications.subscribe "beanstalk.event.push" do |name, start, finish, id, payload|
	Common::WebhookService.build_event_and_add_to_feeds(Beanstalk::Event::Push, payload)
end