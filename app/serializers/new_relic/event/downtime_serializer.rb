class NewRelic::Event::DowntimeSerializer < FeedItemSerializer
	attributes :application_name, :account_name, :severity, :message, :short_description, :long_description, :alert_url
end
