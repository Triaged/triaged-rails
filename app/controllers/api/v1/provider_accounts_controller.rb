class Api::V1::ProviderAccountsController < API::BaseController

	private

  def set_provider_account
  	@provider_account = current_user.company.provider_accounts.find(params[:id])
  end


end
