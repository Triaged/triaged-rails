class Crashlytics::Event::Issue < BaseServiceEvent
  
  def self.build_from_webhook data, company
		event = {
			company_id: company.id.to_s,
			provider_name: self.provider_name,
			event_name: self.event_name,
			account_name: nil,
			property_name: data.app.name,
			author: nil,
			external_id: data.display_id,
			title: 	data.title,
			body: data["method"].truncate(320),
			footer:  "#{data.impacted_devices_count} Impacted Devices",
			timestamp: DateTime.now,
			url: data.url,
			push_notify: true,
			group_event: true
		}
		return event.to_json
	end

end