class NewRelic::Event::AppAlert < FeedItem
  include Mongoid::Document

  field :application_name, :type => String
  field :account_name, :type => String
  field :severity, :type => String
  field :message, :type => String
  field :short_description, :type => String
  field :long_description, :type => String
  
  
	def self.build_from_webhook data
		event = NewRelic::Event::AppAlert.new(
			external_id: data.external_id,
			timestamp: data.created_at,
			application_name: data.application_name,
			account_name: data.application_name,
			severity: data.severity,
			message: data.message,
			short_description: data.short_description,
			long_description: data.long_description,
			html_url: data.alert_url
		)
	end

	def should_push?
		true
	end

	def push_message
		message
	end

end