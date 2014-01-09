class HockeyApp::Event::CrashReason < Cards::Event
  include Mongoid::Document

  def self.build_from_webhook data, company
		event = {
			type: :event,
			company_id: company.id,
			provider_name: self.provider_name,
			title: 	data.title,
			provider_account_name: nil,
			should_push: false,
			external_id: data.public_identifier,
			property_name: data.title.split("for ").last,
			description: data.crash_reason.reason,
			footer:  "#{data.class_name} in #{data.method_name} at #{data.line}",
			timestamp: data.sent_at,
			url: data.url,
		}
		return event.to_json
	end
 
end
