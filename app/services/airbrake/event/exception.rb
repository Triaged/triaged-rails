class Airbrake::Event::Exception < BaseServiceEvent
  
  def self.build_from_webhook data, company
		event = {
			company_id: company.id.to_s,
			provider_name: self.provider_name, 
			event_name: self.event_name,
			account_name: nil,
			property_name: data.error.project.name,
			author: nil,
			external_id: data.error.id,
			title: "#{data.error.error_message.capitalize} Exception",
			body: data.error.error_message,
			footer: nil,
			timestamp: DateTime.now,
			url: nil,
			push_notify: true,
			group_event: true
		}
		return event.to_json
	end
end
