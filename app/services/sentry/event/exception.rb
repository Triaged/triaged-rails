class Sentry::Event::Exception < BaseServiceEvent
  

  def self.build_from_webhook data, company
		event = {
			company_id: company.id.to_s,
			provider: {name: self.provider_name }, 
			event_name: self.event_name,
			account_name: nil,
			property_name: data.project,
			external_id: data.id,
			title: "#{data.project.capitalize} #{data.level.capitalize} Exception",
			body: data.message,
			footer: "as #{data.culprit}",
			timestamp: data.created_at,
			url: data.url,
			push_notify: true,
			group_event: true,
			workflows: [ 
				{ name: "assign", provider: "all" },
				{ name: "share", provider: "all" },
				{ name: "explore", provider: "all" },
			] 
		}
		return event.to_json
	end
end