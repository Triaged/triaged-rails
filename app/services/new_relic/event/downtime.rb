class NewRelic::Event::Downtime < BaseServiceEvent
  
  def self.build_from_webhook data, company
		event = {
			type: :event,
			company_id: company.id.to_s,
			provider_name: self.provider_name, 
			event_name: self.event_name,
			external_id: data.external_id,
			title: "Downtime",
			push_notify: true,
			property_name: data.application_name,
			body: data.long_description,
			footer: data.severity,
			timestamp: data.created_at,
			url: nil,
		}
		return event.to_json
	end


end