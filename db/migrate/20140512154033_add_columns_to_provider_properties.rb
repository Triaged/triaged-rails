class AddColumnsToProviderProperties < ActiveRecord::Migration
  def change
  	remove_column :provider_properties, :provider_account_id
  	add_column :provider_properties, :provider_id, :integer
  	add_column :provider_properties, :company_id, :integer
  end
end
