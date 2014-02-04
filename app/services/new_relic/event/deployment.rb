class NewRelic::Event::Deployment < BaseServiceEvent
  
	def self.build_from_webhook data, company
		event = {
			company_id: company.id.to_s,
			provider: {name: self.provider_name }, 
			event_name: self.event_name,
			external_id: data.external_id,
			title: "#{data.application_name.capitalize} Deployed",
			push_notify: false,
			property_name: data.application_name,
			body: data.description,
			footer: data.severity,
			timestamp: data.created_at,
			url: nil,
		}
		return event.to_json
	end



end