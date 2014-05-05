class Api::V1::ProviderAccountsController < API::BaseController
	before_action :set_provider


	def index
		@accounts = Common::RemoteAccountService.fetch_accounts(@provider, current_company)
		respond_with @accounts
	end

	def create
		@account = current_company.provider_accounts.find(params[:account][:id])
		ConnectedProviderAccount.create(company: current_company, company_app: @app, provider_account: @account)

		#Common::RemoteAccountService.set_default_account(@provider, @company, @account)
		redirect_to app_provider_properties_path(@app, @provider)
	end

	def destroy
		provider = @provider_account.provider
		# destroy connected status
		current_company.connected_providers.where(provider: provider).destroy

		# Callback to handle provider specific account cleanup
		Provider.delete_provider_account(@provider_account)

		# Destry provider account details
		@provider_account.destroy
	end

	private

	def set_provider
		@provider = Provider.find(params[:provider_id])
	end

  def set_provider_account
  	@provider_account = current_company.provider_accounts.find(params[:id])
  end


end
