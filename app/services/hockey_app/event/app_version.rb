class HockeyApp::Event::AppVersion < BaseServiceEvent
  
  def self.build_from_webhook data, company
		event = {
			type: :event,
			company_id: company.id.to_s,
			provider: {name: self.provider_name }, event_name: self.event_name,
			title: 	data.title,
			provider: {name: self.provider_name }, event_name: self.event_name,
			push_notify: false,
			external_id: data.public_identifier,
			property_name:  data.app_version.title,
			body: data.app_version.notes,
			footer:  nil,
			timestamp: data.sent_at,
			url: data.url,
		}
		return event.to_json
	end
 
end