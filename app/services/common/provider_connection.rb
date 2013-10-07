module Common::ProviderConnection

	def self.ensure_connected company, provider
		company.connected_providers.find_or_create_by provider: provider
	end
end