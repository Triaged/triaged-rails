class ProviderAccountsController < WebController
	before_action :set_provider
	
	def select
		@accounts = Common::RemoteAccountService.fetch_accounts(@provider, @company)
	end

	def set_account
		@account = @company.provider_accounts.find(params[:account][:id])
		ConnectedProviderAccount.create(company: @company, company_app: @app, provider_account: @account)

		#Common::RemoteAccountService.set_default_account(@provider, @company, @account)
		redirect_to app_provider_properties_path(@app, @provider)
	end

private

	

	def set_provider
		@provider = Provider.find(params[:provider_id])
	end
end
