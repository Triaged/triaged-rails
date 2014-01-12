module Common::ProviderConnection

	def self.ensure_connected company, provider
		puts company
		puts provider
		company.connected_providers.find_or_create_by provider: provider
	end
end