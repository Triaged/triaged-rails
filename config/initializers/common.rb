ActiveSupport::Notifications.subscribe "provider_credentials.created" do |name, start, finish, id, payload|
	company = Company.find(payload[:company_id])
	provider = Provider.named(payload[:provider_name])

	Common::ProviderConnection.ensure_connected(company, provider)
end