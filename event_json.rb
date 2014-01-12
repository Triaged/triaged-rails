event = {
	type: :event,
	company_id: company.id.to_s,
	provider_name: self.provider_name, event_name: self.event_name,
	title: "#{data.error.error_message.capitalize} Exception",
	should_push: true
	author:
	external_id: data.error.id,
	property_name: data.error.project.name,
	description: data.error.error_message
	footer: nil,
	timestamp: nil,
	url: nil,
		
}