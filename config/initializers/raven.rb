require 'raven'

Raven.configure do |config|
  config.dsn = 'https://b40e47a874554ac4891a1901fabeec2e:e190217a02164e9eaf44f8e6e75454ac@app.getsentry.com/13500'
end

ActiveSupport::Notifications.subscribe "event.sentry.exception" do |name, start, finish, id, payload|
  Common::WebhookService.perform_async(Sentry::Event::Exception, payload)
end