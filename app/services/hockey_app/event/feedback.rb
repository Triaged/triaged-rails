class HockeyApp::Event::Feedback < BaseServiceEvent
  
   def self.build_from_webhook data, company
		event = {
			type: :event,
			company_id: company.id,
			provider_name: self.provider_name,
			title: 	"New Feedback",
			provider_account_name: nil,
			should_push: false,
			external_id: data.public_identifier,
			property_name: data.title.split("for ").last,
			description: "#{data.feedback.messages.first.subject}\n#{data.feedback.messages.first.clean_text}",
			footer:  "from #{data.feedback.name}",
			timestamp: data.sent_at,
			url: data.url,
		}
		return event.to_json
	end

end
