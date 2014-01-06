class HockeyApp::Event::AppVersion < Cards::Event
  include Mongoid::Document
  
	def self.build_from_webhook data, company
		# event = HockeyApp::Event::AppVersion.new(
		# 	external_id: data.public_identifier,
		# 	title: data.title.split("for ").last,
			
			
		# 	version: data.app_version.version,
		# 	app_title: data.app_version.app_title,
		# 	notes: data.app_version.notes,
		# 	app_id: data.app_version.app_id
		# )

		event = Airbrake::Event::Exception.new(
			external_id: data.public_identifier,
			property_name: data.error.project.name,
			title: data.title.split("for ").last,
			body: data.app_version.notes,
			timestamp: data.sent_at,
			html_url: data.url,
		)
	end

	def should_push?
		false
	end
end
