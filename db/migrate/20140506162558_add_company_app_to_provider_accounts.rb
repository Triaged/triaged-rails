class AddCompanyAppToProviderAccounts < ActiveRecord::Migration
  def change
    add_reference :provider_accounts, :company_app, index: true
  end
end
