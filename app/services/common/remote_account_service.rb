module Common::RemoteAccountService

	def self.fetch_accounts(provider, company)
		cls = "#{provider.name.camelize}::AccountService".constantize
		accounts = cls.new(company.id).fetch_accounts

		return accounts
	end

	def self.set_default_account(provider, account)
		account.set_default_account!
		cls = "#{provider.name.camelize}::SetupService".constantize
		cls.perform_async(account.id.to_s)
	end


end