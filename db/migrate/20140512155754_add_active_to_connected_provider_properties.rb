class AddActiveToConnectedProviderProperties < ActiveRecord::Migration
  def change
  	add_column :connected_provider_properties, :active, :boolean
  	add_column :connected_provider_accounts, :status, :integer
  end
end
