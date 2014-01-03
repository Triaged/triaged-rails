ActiveSupport::Notifications.subscribe "event.bitbucket.push" do |name, start, finish, id, payload|
	Common::WebhookService.build_event_and_add_to_feeds(Bitbucket::Event::Push, payload)
end