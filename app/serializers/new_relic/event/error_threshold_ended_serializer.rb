class NewRelic::Event::ErrorThresholdEndedSerializer < EventSerializer
  attributes :application_name, :account_name, :severity, :message, :short_description, :long_description, :alert_url, :version
end
