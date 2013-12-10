class HockeyApp::Event::Feedback
  include Mongoid::Document

  field :app_id, :type => String
  field :name, :type => String
  field :email, :type => String
  field :subject, :type => String
  field :text, :type => String
  
	def self.build_from_webhook data
		event = HockeyApp::Event::Feedback.new(
			external_id: data.public_identifier,
			title: data.title.split("for ").last,
			timestamp: data.sent_at,
			html_url: data.url,
			app_id: data.crash_reason.app_id,
			name: data.feedback.name,
			email: data.feedback.email,
			subject: data.feedback.messages.first.subject,
			text: data.feedback.messages.first.clean_text
		)
	end



end
