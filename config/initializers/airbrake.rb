Airbrake.configure do |config|
  config.api_key = '7dc1908c1157328306a0897e00c4540d'
end

ActiveSupport::Notifications.subscribe "event.airbrake.exception" do |name, start, finish, id, payload|
  Common::WebhookService.perform_async(Airbrake::Event::Exception, payload)
end
