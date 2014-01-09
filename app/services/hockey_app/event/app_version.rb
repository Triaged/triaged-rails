class HockeyApp::Event::AppVersion < BaseServiceEvent
  
  def self.build_from_webhook data, company
		event = {
			type: :event,
			company_id: company.id,
			provider_name: provider_name,
			title: 	data.title,
			provider_account_name: nil,
			should_push: => false,
			external_id: data.public_identifier,
			property_name:  data.app_version.title,
			description: data.app_version.notes,
			footer:  nil,
			timestamp: data.sent_at,
			url: data.url,
		}
		return event.to_json
	end
 
end