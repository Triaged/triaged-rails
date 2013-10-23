ActiveSupport::Notifications.subscribe "event.beanstalk.push" do |name, start, finish, id, payload|
	Common::WebhookService.perform_async(Beanstalk::Event::Push, payload)
end