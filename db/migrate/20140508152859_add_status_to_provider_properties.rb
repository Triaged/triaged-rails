class AddStatusToProviderProperties < ActiveRecord::Migration
  def change
    add_column :provider_properties, :status, :integer, default: 0
  end
end
