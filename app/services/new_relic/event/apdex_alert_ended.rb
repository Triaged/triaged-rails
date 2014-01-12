class NewRelic::Event::ApdexAlertEnded < BaseServiceEvent
  
  def self.build_from_webhook data, company
		event = {
			type: :event,
			company_id: company.id.to_s,
			provider_name: self.provider_name, event_name: self.event_name,
			external_id: data.external_id,
			title: "Apdex Alert Ended",
			provider_name: self.provider_name, event_name: self.event_name,
			should_push: true,
			property_name: data.application_name,
			description: data.long_description,
			footer: data.severity,
			timestamp: data.created_at,
			url: nil,
		}
		return event.to_json
	end

end