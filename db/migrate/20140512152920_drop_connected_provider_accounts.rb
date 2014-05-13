class DropConnectedProviderAccounts < ActiveRecord::Migration
  def change
  	drop_table :connected_provider_accounts
  end
end
