class Zapier::Event::Zap < BaseServiceEvent
  
  def self.build_from_webhook data, company
		event = {
			type: :event,
			company_id: company.id.to_s,
			provider_name: self.provider_name, 
			event_name: self.event_name,
			title: data.title,
			should_push: true,
			external_id: data.error.id,
			property_name: data.error.project.name,
			description: data.error.error_message,
			footer: nil,
			timestamp: DateTime.now,
			url: nil,
		}
		return event.to_json
	end
end