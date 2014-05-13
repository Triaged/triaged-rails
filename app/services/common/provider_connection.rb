module Common::ProviderConnection

	def self.ensure_connected company, provider
		company.connected_providers.find_or_create_by provider: provider
	end

	def self.ensure_provider_account company, app, provider
		connected_account = app.connected_provider_accounts.where(provider: provider).first
		ConnectedProviderAccount.create_default!(company, app, provider) unless connected_account
	end
end