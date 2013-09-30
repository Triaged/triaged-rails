class NewRelic::Event::DowntimeSerializer < EventSerializer
	attributes :application_name, :account_name, :severity, :message, :short_description, :long_description, :alert_url, :version
end
