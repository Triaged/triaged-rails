module Common::RemoteAccountService

	def self.fetch_accounts(provider, company)
		account_service_cls = "#{provider.name.camelize}::AccountService".constantize
		accounts = account_service_cls.new(company.id).fetch_accounts

		return accounts
	end

	def self.set_default_account(provider, company, account)
		account.set_default_account!
		
		# Syncronously fetch properties (to ensure they show up after account creation)
		account_service_cls = "#{provider.name.camelize}::AccountService".constantize
		account_service = account_service_cls.new(company.id)
		account_service.fetch_properties if account_service.respond_to?(:fetch_properties)

		# Async hook for setup tasks
		setup_service = "#{provider.name.camelize}::SetupService".constantize
		setup_service.perform_async(account.id.to_s)
	end


end