ActiveSupport::Notifications.subscribe "event.kiln.push" do |name, start, finish, id, payload|
	Common::WebhookService.perform_async(Kiln::Event::Push, payload)
end