class NewRelic::Event::Deployment < BaseServiceEvent
  
	def self.build_from_webhook data, company
		event = {
			type: :event,
			company_id: company.id,
			provider_name: self.provider_name,
			external_id: data.external_id,
			title: "Deployment",
			provider_account_name: nil,
			should_push: false,
			property_name: data.application_name,
			description: data.description,
			footer: data.severity,
			timestamp: data.created_at,
			url: nil,
		}
		return event.to_json
	end



end