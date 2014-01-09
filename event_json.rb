event = {
	type: :event,
	company_id: company.id,
	provider_name: provider_name,
	title: "#{data.error.error_message.capitalize} Exception",
	provider_account_name: nil,
	should_push: true
	author:
	external_id: data.error.id,
	property_name: data.error.project.name,
	description: data.error.error_message
	footer: nil,
	timestamp: nil,
	url: nil,
		
}