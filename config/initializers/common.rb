ActiveSupport::Notifications.subscribe "provider_credentials.created" do |name, start, finish, id, payload|
	company = Company.find(payload[:company_id])
	provider = Provider.named(name.split(".").last)

	Common::ProviderConnection.ensure_connected(company, provider)
end