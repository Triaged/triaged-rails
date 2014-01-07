class App::ProviderAccountsController < ApplicationController
	before_action :authenticate_user!
	before_action :set_provider
	before_action :set_company

	def select
		@accounts = Common::RemoteAccountService.fetch_accounts(@provider, @company)
	end

	def set_account
		@account = @company.provider_accounts.find(params[:account][:id])
		Common::RemoteAccountService.set_default_account(@provider, @company, @account)
		redirect_to(oauth_complete_path)
	end

private

	def set_company
		@company = current_user.company
	end

	def set_provider
		@provider = Provider.find(params[:provider_id])
	end
end
