ActiveSupport::Notifications.subscribe "event.kiln.push" do |name, start, finish, id, payload|
	Common::WebhookService.build_event_and_add_to_feeds(Kiln::Event::Push, payload)
end