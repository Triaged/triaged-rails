class NewRelic::Event::ErrorThresholdEnded < FeedItem
  include Mongoid::Document

  field :application_name, :type => String
  field :account_name, :type => String
  field :severity, :type => String
  field :message, :type => String
  field :short_description, :type => String
  field :long_description, :type => String
  field :alert_url, :type => String

  
	def self.build_from_webhook data
		event = NewRelic::Event::ErrorThresholdEnded.new(
			external_id: data.external_id,
			timestamp: data.created_at,
			application_name: data.application_name,
			account_name: data.application_name,
			severity: data.severity,
			message: data.message,
			short_description: data.short_description,
			long_description: data.long_description,
			alert_url: data.alert_url
		)
	end

end