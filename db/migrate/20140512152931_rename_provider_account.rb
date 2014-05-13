class RenameProviderAccount < ActiveRecord::Migration
  def change
  	rename_table :provider_accounts, :connected_provider_accounts
  end
end
