class HockeyApp::Event::CrashReason < Cards::Event
  include Mongoid::Document
  
	def self.build_from_webhook data, company
		# event = HockeyApp::Event::CrashReason.new(
		# 	external_id: data.public_identifier,
		# 	title: data.title.split("for ").last,
		# 	timestamp: data.sent_at,
		# 	html_url: data.url,
		# 	app_id: data.crash_reason.app_id,
		# 	reason: data.crash_reason.reason,
		# 	method_name: data.crash_reason["method"],
		# 	file: data.crash_reason.file,
		# 	class_name: data.crash_reason.class,
		# 	line: data.crash_reason.line,
		# )

		event = Airbrake::Event::Exception.new(
			external_id: data.public_identifier,
			property_name: data.title.split("for ").last,
			title: "New Crash",
			body: data.crash_reason.reason,
			footer: "#{object.class_name} in #{object.method_name} at #{object.line}",
			timestamp: data.sent_at,
			html_url: data.url
		)
	end

	def should_push?
		true
	end
end
