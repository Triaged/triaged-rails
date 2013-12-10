class HockeyApp::Event::AppVersion < HockeyApp::BaseEvent
  include Mongoid::Document

  field :version, :type => String
  field :app_title, :type => String
  field :notes, :type => String
  field :app_id, :type => String
  
	def self.build_from_webhook data
		event = HockeyApp::Event::AppVersion.new(
			external_id: data.public_identifier,
			title: data.title.split("for ").last,
			timestamp: data.sent_at,
			html_url: data.url,
			version: data.app_version.version,
			app_title: data.app_version.app_title,
			notes: data.app_version.notes,
			app_id: data.app_version.app_id
		)
	end

	def should_push?
		false
	end

	def push_message
		message
	end


end
