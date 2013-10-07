ActiveSupport::Notifications.subscribe "event.new_relic.deployment" do |name, start, finish, id, payload|
	Common::WebhookService.build_event_and_add_to_feeds(NewRelic::Event::Deployment, payload)
end

ActiveSupport::Notifications.subscribe "event.new_relic.app_alert" do |name, start, finish, id, payload|
	Common::WebhookService.build_event_and_add_to_feeds(NewRelic::Event::AppAlert, payload)
end

ActiveSupport::Notifications.subscribe "event.new_relic.downtime" do |name, start, finish, id, payload|
	Common::WebhookService.build_event_and_add_to_feeds(NewRelic::Event::Downtime, payload)
end

ActiveSupport::Notifications.subscribe "event.new_relic.downtime_ended" do |name, start, finish, id, payload|
	Common::WebhookService.build_event_and_add_to_feeds(NewRelic::Event::DowntimeEnded, payload)
end

ActiveSupport::Notifications.subscribe "event.new_relic.error_threshold" do |name, start, finish, id, payload|
	Common::WebhookService.build_event_and_add_to_feeds(NewRelic::Event::ErrorThreshold, payload)
end

ActiveSupport::Notifications.subscribe "event.new_relic.error_threshold_ended" do |name, start, finish, id, payload|
	Common::WebhookService.build_event_and_add_to_feeds(NewRelic::Event::ErrorThresholdEnded, payload)
end

ActiveSupport::Notifications.subscribe "event.new_relic.apdex_alert" do |name, start, finish, id, payload|
	Common::WebhookService.build_event_and_add_to_feeds(NewRelic::Event::ApdexAlert, payload)
end

ActiveSupport::Notifications.subscribe "event.new_relic.apdex_alert_ended" do |name, start, finish, id, payload|
	Common::WebhookService.build_event_and_add_to_feeds(NewRelic::Event::ApdexAlertEnded, payload)
end
