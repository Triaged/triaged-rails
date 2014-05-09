module Common::RemoteAccountService

	def self.fetch_accounts(current_user, provider, company, app)
		account_service_cls = "#{provider.name.camelize}::AccountService".constantize
		credentials = Common::RemoteAccountService.find_provider_credentials(current_user, provider)

		accounts = account_service_cls.new(company.id, credentials).fetch_accounts.flatten

		Common::RemoteAccountService.set_default_account(current_user, provider, company, app, nil) if accounts.empty? || accounts.nil?
		Common::RemoteAccountService.set_account(current_user, provider, company, app, accounts.first) if accounts.length == 1

		return accounts
	end

	def self.set_account_and_fetch_properties(current_user, provider, company, app, account_params)
		Common::RemoteAccountService.set_account(current_user, provider, company, app, account_params)
		Common::RemoteAccountService.fetch_properties(current_user, provider, company, app, account_params)
	end

	def self.set_account(current_user, provider, company, app, account_params)
		credentials = Common::RemoteAccountService.find_provider_credentials(current_user, provider)
		
		account = ProviderAccount.create(
			company: company, 
			company_app: app, 
			provider: provider,
			provider_credential: credentials,
			external_id: account_params[:external_id],
			name: account_params[:name],
			personal: account_params[:personal]
		)
	end

	def self.set_default_account(current_user, provider, company, app, account_params)
		credentials = Common::RemoteAccountService.find_provider_credentials(current_user, provider)
		
		account = ProviderAccount.create(
			company: company, 
			company_app: app, 
			provider: provider,
			provider_credential: credentials,
			external_id: nil,
			name: "default",
			default: true
		)
	end

	def self.fetch_properties(current_user, provider, company, app, account_params)
		credentials = Common::RemoteAccountService.find_provider_credentials(current_user, provider)
		# Syncronously fetch properties (to ensure they show up after account creation)
		account_service_cls = "#{provider.name.camelize}::AccountService".constantize
		account_service = account_service_cls.new(company.id, credentials)
		account_service.fetch_properties(account) if account_service.respond_to?(:fetch_properties)
	end


	def self.setup_property(current_user, provider, company, app, property)
		# Async hook for setup tasks
		setup_service = "#{provider.name.camelize}::SetupService".constantize
		setup_service.perform_async(property.id.to_s)
	end

private 

	def self.find_provider_credentials current_user, provider
		ProviderCredential.find_by(user: current_user, provider: provider)
	end



end