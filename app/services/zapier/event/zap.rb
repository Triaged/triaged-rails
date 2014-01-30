class Zapier::Event::Zap < BaseServiceEvent
  
  def self.build_from_webhook data, company
		event = {
			company_id: company.id.to_s,
			provider_name: self.provider_name, 
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
		return event.to_json
	end
end