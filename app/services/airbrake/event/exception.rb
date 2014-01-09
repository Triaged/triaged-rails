class Airbrake::Event::Exception < BaseServiceEvent
  
  def self.build_from_webhook data, company
		event = {
			type: :event,
			company_id: company.id,
			provider_name: provider_name,
			title: "#{data.error.error_message.capitalize} Exception",
			provider_account_name: nil,
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