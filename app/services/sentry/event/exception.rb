class Sentry::Event::Exception < BaseServiceEvent
  

  def self.build_from_webhook data, company
		event = {
			type: :event,
			company_id: company.id.to_s,
			provider_name: self.provider_name, event_name: self.event_name,
			external_id: data.id,
			title: "#{data.level.capitalize} Exception",
			provider_name: self.provider_name, event_name: self.event_name,
			property_name: data.project,
			description: data.message,
			footer: "as #{data.culprit}",
			should_push: true,
			timestamp: data.created_at,
			url: nil,
		}
		return event.to_json
	end


end