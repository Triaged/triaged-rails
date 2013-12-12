class HockeyApp::Event::CrashReason  < HockeyApp::BaseEvent
  include Mongoid::Document

  field :app_id, :type => String
  field :reason, :type => String
  field :method_name, :type => String
  field :file, :type => String
  field :class_name, :type => String
  field :line, :type => String
  
	def self.build_from_webhook data
		event = HockeyApp::Event::CrashReason.new(
			external_id: data.public_identifier,
			title: data.title.split("for ").last,
			timestamp: data.sent_at,
			html_url: data.url,
			app_id: data.crash_reason.app_id,
			reason: data.crash_reason.reason,
			method_name: data.crash_reason["method"],
			file: data.crash_reason.file,
			class_name: data.crash_reason.class,
			line: data.crash_reason.line,
		)
	end

	def should_push?
		true
	end

	def push_message
		message
	end
end
