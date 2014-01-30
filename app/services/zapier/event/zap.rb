class Zapier::Event::Zap < BaseServiceEvent
  
  def self.build_from_webhook data, company
		event = {
			company_id: company.id.to_s,
			provider_name: data.service.name, 
			event_name: data.event_name,
			account_name: data.account_name,
			property_name: data.property_name,
			author: nil,
			external_id: data.external_id,
			title: data.title,
			body: data.body,
			footer: data.footer,
			timestamp: data.timestamp,
			url: data.url,
			push_notify: false,
			group_event: false
		}

		event[:provider] = {
			name: data.service.name,
			small_icon: data.service.logos.32x32,
			large_icon: data.service.logos.64x64
		}

		return event.to_json
	end
end