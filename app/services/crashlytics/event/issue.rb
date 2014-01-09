class Crashlytics::Event::Issue < BaseServiceEvent
  
  def self.build_from_webhook data, company
		event = {
			type: :event,
			company_id: company.id.to_s,
			provider_name: self.provider_name, event_name: self.event_name,
			title: 	data.title,
			provider_account_name: nil,
			should_push: true,
			external_id: data.display_id,
			property_name:  data.app.name,
			description: data["method"].truncate(320),
			footer:  "#{data.impacted_devices_count} Impacted Devices",
			timestamp: DateTime.now,
			url: data.url,
		}
		return event.to_json
	end

end