class NewRelic::Event::ApdexAlertSerializer < FeedItemSerializer
  attributes :application_name, :account_name, :severity, :message, :short_description, :long_description
end
