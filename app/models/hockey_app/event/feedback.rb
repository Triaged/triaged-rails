class HockeyApp::Event::Feedback < Cards::Event
  include Mongoid::Document

	def self.build_from_webhook data
		# event = HockeyApp::Event::Feedback.new(
		# 	external_id: data.public_identifier,
		# 	title: data.title.split("for ").last,
		# 	timestamp: data.sent_at,
		# 	html_url: data.url,
		# 	app_id: data.crash_reason.app_id,
		# 	name: data.feedback.name,
		# 	email: data.feedback.email,
		# 	subject: data.feedback.messages.first.subject,
		# 	text: data.feedback.messages.first.clean_text
		# )

		event = HockeyApp::Event::Feedback.new(
			external_id: data.public_identifier,
			property_name: data.title.split("for ").last,
			title: "New Feedback from #{data.feedback.name}",
			body: "#{data.feedback.messages.first.subject}\n#{data.feedback.messages.first.clean_text}",
			timestamp: data.sent_at,
			html_url: data.url
		)
	end



end
