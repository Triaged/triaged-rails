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
		account = Common::RemoteAccountService.set_account(current_user, provider, company, app, account_params)
		Common::RemoteAccountService.fetch_properties(current_user, provider, company, app, account)
	end

	def self.set_account(current_user, provider, company, app, account_params)
		credentials = Common::RemoteAccountService.find_provider_credentials(current_user, provider)
		
		account = ConnectedProviderAccount.create(
			company: company, 
			company_app: app, 
			provider: provider,
			provider_credential: credentials,
			external_id: account_params[:external_id],
			name: account_params[:name],
			personal: account_params[:personal]
		)

		Rails.logger.info account.errors.inspect

		return account
	end

	def self.set_default_account(current_user, provider, company, app, account_params)
		credentials = Common::RemoteAccountService.find_provider_credentials(current_user, provider)
		account = ConnectedProviderAccount.create_default! company, app, provider, credentials
	end

	def self.fetch_properties(current_user, provider, company, app, account)
		credentials = Common::RemoteAccountService.find_provider_credentials(current_user, provider)
		# Syncronously fetch properties (to ensure they show up after account creation)
		account_service_cls = "#{provider.name.camelize}::AccountService".constantize
		account_service = account_service_cls.new(company.id, credentials)

		if account_service.respond_to?(:fetch_properties)
			properties = account_service.fetch_properties(account)
			properties.each do |property_hash|
				
				property = account.provider_properties.find_or_initialize_by(
					external_id: property_hash[:external_id],
					provider: provider,
					company: company,
					)

				if property.new_record?
					property.url = property_hash[:url],
					property.name =property_hash[:name],
					property.save
				end
				Rails.logger.info "Errors: #{property.errors.inspect}"
				Rails.logger.info "Account: #{account.inspect}"
				Rails.logger.info "Property: #{property.inspect}"
				Rails.logger.info "--------"
				ConnectedAccountProviderProperty.create(connected_provider_account: account, provider_property: property)
			end
		end
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