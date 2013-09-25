Airbrake.configure do |config|
  config.api_key = '7dc1908c1157328306a0897e00c4540d'
end

ActiveSupport::Notifications.subscribe "airbrake.exception" do |name, start, finish, id, payload|
  Common::WebhookService.build_event_and_add_to_feeds(Airbrake::Event::Exception, payload)
end
