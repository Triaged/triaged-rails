class AddProviderCredentialToProviderAccounts < ActiveRecord::Migration
  def change
    add_reference :provider_accounts, :provider_credential, index: true
  end
end
