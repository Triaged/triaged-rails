class Crashlytics::Event::Issue < FeedItem
  include Mongoid::Document

  field :app_name, :type => String
  field :bundle_identifer, :type => String
  field :platform, :type => String
  field :title, :type => String
  field :method_name, :type => String
  field :impact_level, :type => Integer
  field :crashes_count, :type => Integer
  field :impacted_devices_count, :type => Integer

  
	def self.build_from_webhook data
		event = Crashlytics::Event::Issue.new(
			app_name: data.app.name,
			bundle_identifer: data.app.bundle_identifer,
			platform: data.app.platform,
			external_id: data.display_id,
			title: data.title,
			method_name: data["method"],
			impact_level: data.impact_level,
			crashes_count: data.crashes_count,
			impacted_devices_count: data.impacted_devices_count,
			html_url: data.url
		)
	end

	def should_push?
		false
	end

	def push_message
		title
	end

end