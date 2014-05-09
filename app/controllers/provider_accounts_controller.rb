class ProviderAccountsController < WebController
	before_action :set_provider
	
	def select
		@accounts = Common::RemoteAccountService.fetch_accounts(current_user, @provider, @company, @app)
		redirect_to app_provider_properties_path(@app, @provider) unless @accounts.length > 1
	end

	def set_account
		Common::RemoteAccountService.set_account_and_fetch_properties(current_user, @provider, @company, @app, params[:account])
		redirect_to app_provider_properties_path(@app, @provider)
	end

	

private

	def finalize_account_and_redirect
		
	end

	def set_provider
		@provider = Provider.find(params[:provider_id])
	end
end
