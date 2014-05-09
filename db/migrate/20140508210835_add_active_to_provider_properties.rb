class AddActiveToProviderProperties < ActiveRecord::Migration
  def change
  	add_column :provider_properties, :active, :boolean, default: false
  	remove_column :provider_properties, :status
  end
end
