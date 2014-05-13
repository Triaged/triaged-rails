class Api::V1::ProviderAccountsController < API::BaseController
	include OauthGateway

	before_action :set_provider
	before_filter :validate_oauth, :only => :index


	def index
		@accounts = Common::RemoteAccountService.fetch_accounts(current_user, @provider, current_company)
		respond_with @accounts
	end

	def create
		Common::RemoteAccountService.set_account(current_user, @provider, @company, @app, params[:account])
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
  	@provider_account = current_company.connected_provider_accounts.find(params[:id])
  end


end
