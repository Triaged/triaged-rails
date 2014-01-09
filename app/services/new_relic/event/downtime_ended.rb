class NewRelic::Event::DowntimeEnded < BaseServiceEvent
  
  def self.build_from_webhook data, company
		event = {
			type: :event,
			company_id: company.id,
			provider_name: provider_name,
			external_id: data.external_id,
			title: "Downtime Ended",
			provider_account_name: nil,
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