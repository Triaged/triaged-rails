class ProviderAccountsController < WebController
	before_action :set_provider
	
	def select
		@accounts = Common::RemoteAccountService.fetch_accounts(current_user, @provider, @company)
	end

	def set_account
		Common::RemoteAccountService.set_default_account(current_user, @provider, @company, @app, params[:account])
		redirect_to app_provider_properties_path(@app, @provider)
	end

private

	def set_provider
		@provider = Provider.find(params[:provider_id])
	end
end
