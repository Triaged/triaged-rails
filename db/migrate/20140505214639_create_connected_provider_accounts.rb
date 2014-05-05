class CreateConnectedProviderAccounts < ActiveRecord::Migration
  def change
    create_table :connected_provider_accounts do |t|
      t.references :company, index: true
      t.references :company_app, index: true
      t.references :provider_account, index: true

      t.timestamps
    end
  end
end
