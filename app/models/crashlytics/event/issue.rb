class Crashlytics::Event::Issue < FeedItem
  include Mongoid::Document

  field :title, :type => String
  field :method, :type => String
  field :impact_level, :type => Integer
  field :crashes_count, :type => Integer
  field :impacted_devices_count, :type => Integer

  
	def self.build_from_webhook data
		event = Crashlytics::Event::Issue.new(
			external_id: data.display_id,
			title: data.title,
			method: data.method,
			impact_level: data.impact_level,
			crashes_count: data.crashes_count,
			impacted_devices_count: data.impacted_devices_count,
			timestamp: DateTime.now,
			html_url: data.url
		)
	end

	def should_push?
		true
	end

	def push_message
		title
	end

end