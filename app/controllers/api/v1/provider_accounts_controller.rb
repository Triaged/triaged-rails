class Api::V1::ProviderAccountsController < API::BaseController

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

  def set_provider_account
  	@provider_account = current_company.provider_accounts.find(params[:id])
  end


end
