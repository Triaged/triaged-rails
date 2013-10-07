class NewRelic::Event::ErrorThresholdEndedSerializer < FeedItemSerializer
  attributes :application_name, :account_name, :severity, :message, :short_description, :long_description
end
